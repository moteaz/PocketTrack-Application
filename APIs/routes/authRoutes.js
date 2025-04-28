const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { signup, login,getUser,editUser} = require('../controllers/authController');
const fs = require('fs');
const verifyToken = require('../middleware/verifyToken');

const userPhotosDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(userPhotosDir)) {
  fs.mkdirSync(userPhotosDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/signup', upload.single('profile_pic'), signup);
router.post('/login', login);
router.get('/user', verifyToken, getUser);
router.put('/edit', verifyToken, upload.single('profile_pic'), editUser);

module.exports = router;
