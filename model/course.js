const mongoose = require("mongoose");

const schema = mongoose.Schema;

const multer = require("multer");

const storage = multer.memoryStorage();

// Filter for image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Set up multer upload
const upload = multer({ storage: storage, fileFilter: fileFilter });

const courseSchema = new schema({
  title: { type: String, required: true },
  fee : {type : String , required : true},
  duration: { type: String, required: true },
  description : {type : Object, required : true},
  previewImage: {
    type: String, // Assuming storing image path as string
    required: true
  }
});

courseSchema.statics.uploadPreviewImage = upload.single('previewImage');

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;


