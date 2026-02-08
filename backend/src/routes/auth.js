const express = require('express');
const router = express.Router();
const { signup, login, me } = require('../controllers/authController');
const { validate } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');

router.post('/signup', validate('signup'), signup);
router.post('/login', validate('login'), login);

router.get('/me', authMiddleware, me);

module.exports = router;
