const Blog = require("../model/blog");
const bucket = require("../bucket");
const path = require("path");


exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find();
    if (blogs.length < 1 || !blogs) {
      return res.status(404).json({ message: "No blog found." });
    }
    res.status(200).json({ message: "blog found.", blogs: blogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleBlog = async (req, res, next) => {
  try {
    const {blogId} = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "No blog found." });
    }
    res.status(200).json({ message: "blog found.", blog: blog});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.addBlog = async (req, res)=>{
  try {
    const { title, points, tags, para } = req.body;
    const parsedPoints = JSON.parse(points);

    const files = req.files;
    const previewImageFile = files.previewImage ? files.previewImage[0] : null;

    if(!previewImageFile){
      res.status(404).json({message : "Preview Image required."});
    }
    
    const blob = bucket.file(Date.now() + "-" + previewImageFile.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: previewImageFile.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      return res.status(500).json({ message: err.message });
    });

    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      const newBlog = new Blog({
        title: title,
        points : parsedPoints,
        previewImage: publicUrl,
        tags: tags, 
        para : para
      });

      try {
        await newBlog.save();
        res.status(201).json({ message: 'Course created successfully', blog: newBlog });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    });

    blobStream.end(previewImageFile.buffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


exports.updateBlog = async (req, res) => {
  const { blogId } = req.params;
  const { title, points, para } = req.body;
  const files = req.files;
  const previewImageFile = files && files.previewImage ? files.previewImage[0] : null;

  let parsedPoints;

  try {
    parsedPoints = JSON.parse(points);
  } catch (err) {
    return res.status(400).json('Invalid points format');
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json('Blog not found');
    }

    // Handle previewImage upload
    if (previewImageFile) {
      try {
        // Delete old preview image from Firebase if it exists
        if (blog.previewImage) {
          const oldPreviewImageName = blog.previewImage.split('/').pop();
          await bucket.file(oldPreviewImageName).delete();
        }

        // Upload new preview image
        const blob = bucket.file(previewImageFile.originalname);
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: previewImageFile.mimetype,
          },
        });

        await new Promise((resolve, reject) => {
          blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            blog.previewImage = publicUrl;
            resolve();
          }).on('error', (err) => {
            reject(err);
          }).end(previewImageFile.buffer);
        });

      } catch (uploadError) {
        console.log(uploadError);
        return res.status(500).json(`Error uploading image: ${uploadError.message}`);
      }
    }

    blog.title = title;
    blog.points = parsedPoints;
    blog.para = para;

    await blog.save();
    res.status(200).json('Blog updated successfully!');
  } catch (err) {
    console.log(err);
    res.status(500).json(`Error updating blog: ${err.message}`);
  }
};


exports.deleteBlog =async (req, res) => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json('Blog not found');
    }

    // Delete the preview image from Firebase if it exists
    if (blog.previewImage) {
      const oldPreviewImageName = blog.previewImage.split('/').pop();
      await bucket.file(oldPreviewImageName).delete();
    }

    // Delete point images from Firebase if they exist
    for (const key in blog.points) {
      if (blog.points[key].image) {
        const oldPointImageName = blog.points[key].image.split('/').pop();
        await bucket.file(oldPointImageName).delete();
      }
    }

    // Delete the blog document from MongoDB
    await Blog.findByIdAndDelete(blogId);

    res.status(200).json('Blog deleted successfully!');
  } catch (err) {
    res.status(500).json(`Error deleting blog: ${err.message}`);
  }
}

exports.addComment = async (req, res)=>{
  const blogId = req.params.blogId;
  const {text, author} = req.body;
  try{
    const blog = await Blog.findById(blogId);
    if(!blog){
      res.status(404).json({message : 'blog not found'})
    }
    const newComment = {
      text,
      author
    }

    blog.comments.push(newComment)

    await blog.save();

    res.status(201).json({message : 'comment uploaded'})
  }catch(error){
    res.status(500).json({error : error.message});
  }
}

exports.deleteComment = async (req, res) => {
  const { blogId, commentId } = req.params;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json('Blog not found');
    }

    const commentIndex = blog.comments.findIndex(comment => comment._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).json('Comment not found');
    }

    blog.comments.splice(commentIndex, 1);
    await blog.save();

    res.status(200).json({message :'Comment deleted successfully!'});
  } catch (err) {
   res.status(500).json({error : err.message});
  }
};
