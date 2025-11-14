const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { signup, login,getUser,editUser} = require('../controllers/authController');
const fs = require('fs');
const verifyToken = require('../middleware/verifyToken');
const { body } = require('express-validator');
const { validationResult } = require('express-validator');

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

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

const signupValidation = [
  body('fullname').isString().isLength({ min: 2 }).withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').exists().withMessage('Password is required'),
];

const editValidation = [
  body('fullname').optional().isString().isLength({ min: 2 }),
  body('email').optional().isEmail(),
  body('password').optional().isLength({ min: 6 }),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/', upload.single('profile_pic'), signupValidation, validate, signup);
router.post('/login', loginValidation, validate, login);
router.get('/user', verifyToken, getUser);
router.put('/', verifyToken, upload.single('profile_pic'), editValidation, validate, editUser);

module.exports = router;
