const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { FILE_UPLOAD } = require('../utils/constants');

const userPhotosDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(userPhotosDir)) {
  fs.mkdirSync(userPhotosDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FILE_UPLOAD.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const extname = FILE_UPLOAD.ALLOWED_TYPES.test(path.extname(file.originalname).toLowerCase());
  const mimetype = FILE_UPLOAD.ALLOWED_TYPES.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: FILE_UPLOAD.MAX_SIZE },
});

module.exports = upload;
