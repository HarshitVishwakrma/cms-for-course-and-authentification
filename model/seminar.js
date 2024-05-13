const mongoose = require('mongoose');
const schema = mongoose.Schema;

const multer = require('multer');

const storage = multer.diskStorage({
    destination : function (req, file, cb){
        cb(null, 'uploads/');
    },
    filename : function(req, file, cb){
        cb(null, Date.now() + "-" + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  };

const upload = multer({storage : storage, fileFilter: fileFilter});


const seminarSchema = new schema({
    title : {type : String, required : true},
    description : {type : String, required : true},
    previewImage : {type : String, required : true},
    place : {type : String, required : true}
})

seminarSchema.statics.uploadPreviewImage = upload.single('previewImage')

const Seminar = mongoose.model('Seminar', seminarSchema);

module.exports = Seminar;