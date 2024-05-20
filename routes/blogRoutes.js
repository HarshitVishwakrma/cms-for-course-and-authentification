const express = require('express');

const router = express.Router();

const blogController = require('../controller/blogController');
const authController = require('../controller/authController');
const Blog = require('../model/blog')

router.get('/blogs', blogController.getBlogs);
router.post('/blogs',authController.authenticateUser, Blog.uploadPreviewImage, blogController.addBlog);
router.delete('/blogs/:blogId',authController.authenticateUser, blogController.deleteBlog);
router.put('/blogs/:blogId',authController.authenticateUser, Blog.uploadPreviewImage, blogController.updateBlog)


module.exports = router;