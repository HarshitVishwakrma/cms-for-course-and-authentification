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



function getFormattedDateTime() {
    const today = new Date();
  
    // Get the date components
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
  
    // Get the time components
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');
  
    // Format the date and time
    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
  
    // Concatenate date and time
    const formattedDateTime = `${formattedDate} ${formattedTime}`;
  
    return formattedDateTime;
  }



const commentSchema = new schema({
    text: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: getFormattedDateTime() }
  });

const blogSchema = new schema({
    title : {type : String, required : true},
    points : {type : Object, required : true},
    previewImage : {type : String, required : true},
    comments : {type : [commentSchema], default : []},
    createdAt : {type : Date, default : getFormattedDateTime() }
})

blogSchema.statics.uploadPreviewImage = upload.single('previewImage')

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;