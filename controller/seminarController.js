const Seminar = require('../model/seminar')

exports.getSeminars = async (req, res, next)=>{
    try{
        const seminars = await Seminar.find();
        if(seminars.length < 1 || !seminars){
            return res.status(404).json({message : 'No seminars found.'});
        }
        res.status(200).json({message : 'Seminars found.', seminars : seminars});
    }catch(error){
        res.status(500).json({message : error.message});
    }
}

exports.addSeminars = async (req, res, next)=>{
    try{
        const {title, description, place} = req.body;
        const previewImage = req.file;

        const seminar = new Seminar({
            title : title,
            description : description,
            place : place,
            previewImage: previewImage.path
        })

        await seminar.save()

        res.status(201).json({message : 'Seminar uploaded succesfully'});

    }catch(error){
        res.status(500).json({message : error.message})
    }
}

exports.updateSeminars = async (req, res, next)=>{

    try{   
        const {title, description, place} = req.body;
        const seminarId = req.params.seminarId;
        let updateFields = {title, description, place};

        const existingSeminar = await Seminar.findById(seminarId);

        if(!existingSeminar){
            return res.status(404).json({message : 'Seminar not found'});
        }

        if(req.file){
            const fs = require('fs');
            fs.unlinkSync(existingSeminar.previewImage);
            updateFields.previewImage = req.file.path;
        }
        
        const updatedSeminar = await Seminar.findByIdAndUpdate(seminarId, updateFields, {new : true})

        if(!updatedSeminar){
            return res.status(404).json({message : 'Seminar not found!'});
        }

        res.status(201).json({message : 'Seminar updated succesfully'})

    }catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

exports.deleteSeminars = async (req, res, next)=>{
    try{
        const seminarId = req.params.seminarId;

        const existingSeminar = await Seminar.findById(seminarId);

        if(!existingSeminar){
            return res.status(404).json({message : 'Course not found'})
        }

        const fs = require('fs');
        fs.unlinkSync(existingSeminar.previewImage);

        const deleteSeminar = await Seminar.findByIdAndDelete(seminarId);
        if(!deleteSeminar){
            return res.status(401).json({message : 'failed to delete seminar'});
        }
        res.status(201).json({message : 'seminar deleted'});
    }catch(error){
        res.status(500).json({error : error.message})
    }
}