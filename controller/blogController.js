const Blog = require("../model/blog");
const bucket = require("../bucket");
const path = require('path')

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

exports.addBlog = async (req, res, next) => {
    const { title, points } = req.body;
    const previewImage = req.file;

    const blob = bucket.file(Date.now() + "-" + previewImage.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on('finish', async ()=>{

        console.log('reached here')
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        const blog = new Blog({
            title : title,
            points : points,
            previewImage : publicUrl
        })

        try{
            await blog.save()
            res.json({'message': 'Blog uploaded succesfully'})
        }catch(error){
            res.json({"message": error.message})
        }
    })

    // const blog = new Blog({
    //   title: title,
    //   points: points,
    //   previewImage: previewImage.path,
    // });

    // await blog.save();

    // res.status(201).json({ message: "Blog uploaded succesfully" });
    blobStream.end(previewImage.buffer);
};

// exports.updateBlog = async (req, res, next) => {
//   try {
//     const { title, points } = req.body;
//     const blogId = req.params.blogId;
//     let updateFields = { title, points };

//     const existingBlog = await Blog.findById(blogId);

//     if (!existingBlog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     if (req.file) {
//       const fs = require("fs");
//       fs.unlinkSync(existingBlog.previewImage);
//       updateFields.previewImage = req.file.path;
//     }

//     const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateFields, {
//       new: true,
//     });

//     if (!updatedBlog) {
//       return res.status(404).json({ message: "Blog not found!" });
//     }

//     res.status(201).json({ message: "Blog updated succesfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.updateBlog = async (req, res, next) => {
  try {
    const { title, points } = req.body;
    const blogId = req.params.blogId;
    let updateFields = { title, points };

    const existingBlog = await Blog.findById(blogId);

    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (req.file) {
      // Delete the old image from Firebase
      if (existingBlog.previewImage) {
        const oldImagePath = path.basename(existingBlog.previewImage);
        const oldImageBlob = bucket.file(oldImagePath);
        await oldImageBlob.delete();
      }

      // Upload the new image to Firebase
      const newBlob = bucket.file(Date.now() + "-" + req.file.originalname);
      const newBlobStream = newBlob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      newBlobStream.on("error", (err) => {
        return res.status(500).send({ message: err.message });
      });

      newBlobStream.on("finish", async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${newBlob.name}`;
        updateFields.previewImage = publicUrl;

        const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateFields, {
          new: true,
        });

        if (!updatedBlog) {
          return res.status(404).json({ message: "Blog not found!" });
        }

        res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
      });

      newBlobStream.end(req.file.buffer);
    } else {
      const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateFields, {
        new: true,
      });

      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found!" });
      }

      res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;

    const existingBlog = await Blog.findById(blogId);

    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (existingBlog.previewImage) {
      const imagePath = path.basename(existingBlog.previewImage);
      const imageBlob = bucket.file(imagePath);

      try {
        await imageBlob.delete();
      } catch (err) {
        return res.status(500).json({ message: "Failed to delete image from storage", error: err.message });
      }
    }

    const deleteBlog = await Blog.findByIdAndDelete(blogId);
    if (!deleteBlog) {
      return res.status(401).json({ message: "Failed to delete Blog" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// exports.deleteblog = async (req, res, next) => {
//   try {
//     const blogId = req.params.blogId;

//     const existingBlog = await Course.findById(blogId);

//     if (!existingBlog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     const fs = require("fs");
//     fs.unlinkSync(existingBlog.previewImage);

//     const deleteBlog = await Blog.findByIdAndDelete(blogId);
//     if (!deleteBlog) {
//       return res.status(401).json({ message: "failed to delete Blog" });
//     }
//     res.status(201).json({ message: "Blog deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
