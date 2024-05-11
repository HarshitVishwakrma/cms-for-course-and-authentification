const Blog = require('../model/blog')

exports.getBlogs = async (req, res, next)=>{
    try{
        const blogs = await Blog.find();
        if(blogs.length < 1 || !blogs){
            return res.status(404).json({message : 'No blog found.'});
        }
        res.status(200).json({message : 'blog found.', blogs : blogs});
    }catch(error){
        res.status(500).json({message : error.message});
    }
}

exports.addBlog = async (req, res, next)=>{
    try{
        const {title, description} = req.body;
        const previewImage = req.file;

        const blog = new Blog({
            title : title,
            description : description,
            previewImage: previewImage.path
        })

        await blog.save()

        res.status(201).json({message : 'Blog uploaded succesfully'});

    }catch(error){
        res.status(500).json({message : error.message})
    }
}

exports.updateBlog = async (req, res, next)=>{

    try{   
        const {title, description} = req.body;
        const blogId = req.params.blogId;
        let updateFields = {title, description, place};

        const existingBlog = await Blog.findById(blogId);

        if(!existingBlog){
            return res.status(404).json({message : 'Blog not found'});
        }

        if(req.file){
            const fs = require('fs');
            fs.unlinkSync(existingBlog.previewImage);
            updateFields.previewImage = req.file.path;
        }
        
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateFields, {new : true})

        if(!updatedBlog){
            return res.status(404).json({message : 'Blog not found!'});
        }

        res.status(201).json({message : 'Blog updated succesfully'})

    }catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

exports.deleteblog = async (req, res, next)=>{
    try{
        const blogId = req.params.blogId;

        const existingBlog = await Course.findById(blogId);

        if(!existingBlog){
            return res.status(404).json({message : 'Blog not found'})
        }

        const fs = require('fs');
        fs.unlinkSync(existingBlog.previewImage);

        const deleteBlog = await Blog.findByIdAndDelete(blogId);
        if(!deleteBlog){
            return res.status(401).json({message : 'failed to delete Blog'});
        }
        res.status(201).json({message : 'Blog deleted'});
    }catch(error){
        res.status(500).json({error : error.message})
    }
}