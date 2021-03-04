const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (file.mimetype == 'application/pdf') {
      callback(null, true);
    } else {
      console.log('onlyu pdf file supported!');
      callback(null, false);
    }
  }
});

module.exports = upload;
