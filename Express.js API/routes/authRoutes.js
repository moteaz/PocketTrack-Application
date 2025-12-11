const express = require('express');
const router = express.Router();
const { signup, login, getUser, editUser } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/uploadMiddleware');
const validate = require('../middleware/validation');
const validators = require('../utils/validators');

router.post('/', upload.single('profile_pic'), validators.signup, validate, signup);
router.post('/login', validators.login, validate, login);
router.get('/user', verifyToken, getUser);
router.put('/', verifyToken, upload.single('profile_pic'), validators.editUser, validate, editUser);

module.exports = router;
