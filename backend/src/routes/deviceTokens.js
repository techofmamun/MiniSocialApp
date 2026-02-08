const express = require('express');
const router = express.Router();
const { registerDeviceToken } = require('../controllers/deviceTokenController');
const { validate } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', validate('deviceToken'), registerDeviceToken);

module.exports = router;
