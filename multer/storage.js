const path = require('path');
const multer = require('multer');
const { updatesPath } = require('./../config/keys');

const storage = multer.diskStorage({
  destination: updatesPath,
  filename: (req, file, cb) => {
    const fileName = `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter }).single('image');

module.exports = upload;