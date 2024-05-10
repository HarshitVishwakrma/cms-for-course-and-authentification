const Course = require('../model/course')
const jwt = require('jsonwebtoken');

exports.getCourses = async (req, res, next)=>{
    try{
        const courses = await Course.find();
        if(!courses || courses.length < 1){
            return res.status(404).json({message : 'no courses found'});
        }

        res.status(200).json({message : 'courses found', courses : courses});
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

exports.addCourse = async (req, res, next)=>{
    try {
        const { title, description, duration, mentor } = req.body;
        const previewImage = req.file.path; // Get the path of the uploaded image

        const newCourse = new Course({
          title,
          description,
          mentor,
          duration,
          previewImage,
          mentor
        });
    
        await newCourse.save();
    
        res.status(201).json({ message: 'Course created successfully' });
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
      }
}

exports.updateCourse = async (req, res, next)=>{

    try{   
        const {title, description, duration, mentor} = req.body;
        const courseId = req.params.courseId;
        let updateFields = {title, description, duration, mentor};

        const existingCourse = await Course.findById(courseId);

        if(!existingCourse){
            return res.status(404).json({message : 'Course not found'});
        }

        if(req.file){
            const fs = require('fs');
            fs.unlinkSync(existingCourse.previewImage);
            updateFields.previewImage = req.file.path;
        }
        
        const updatedCourse = await Course.findByIdAndUpdate(courseId, updateFields, {new : true})

        if(!updatedCourse){
            return res.status(404).json({message : 'Course not found!'});
        }

        res.status(201).json({message : 'Course updated succesfully'})

    }catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

exports.deleteCourse = async (req, res, next)=>{
    try{
        const courseId = req.params.courseId;

        const existingCourse = await Course.findById(courseId);

        if(!existingCourse){
            return res.status(404).json({message : 'Course not found'})
        }

        const fs = require('fs');
        fs.unlinkSync(existingCourse.previewImage);

        const deleteCourse = await Course.findByIdAndDelete(courseId);
        if(!deleteCourse){
            return res.status(401).json({message : 'failed to delete course'});
        }
        res.status(201).json({message : 'course deleted'});
    }catch(error){
        res.status(500).json({error : error.message})
    }
}