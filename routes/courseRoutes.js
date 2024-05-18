const express = require('express');
const router = express.Router();
const Course = require('../model/course');
const authController  = require('../controller/authController')


const courseController = require('../controller/courseController')

router.get('/courses', courseController.getCourses);

router.post('/courses',authController.authenticateUser,Course.uploadPreviewImage, courseController.addCourse);


router.delete('/courses/:courseId',authController.authenticateUser, courseController.deleteCourse);

router.put('/courses/:courseId',authController.authenticateUser ,Course.uploadPreviewImage, courseController.updateCourse)

module.exports = router;