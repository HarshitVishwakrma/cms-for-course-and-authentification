const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  };

const upload = multer({storage : storage, fileFilter : fileFilter}).fields([
    {name : 'previewImage', maxCount: 1},
    {name : 'pointImages', maxCount : 10}
])

module.exports = upload;