const mongoose = require("mongoose");

const schema = mongoose.Schema;

const multer = require("multer");

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store uploaded files in the uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Generate unique filenames
  },
});

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
  fee : {type : Number , required : true},
  duration: { type: Number, required: true },
  description : {type : Object, required : true},
  previewImage: {
    type: String, // Assuming storing image path as string
    required: true
  }
});

courseSchema.statics.uploadPreviewImage = upload.single('previewImage');

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;


