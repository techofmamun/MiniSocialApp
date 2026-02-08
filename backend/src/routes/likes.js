const express = require('express');
const router = express.Router();
const { toggleLike } = require('../controllers/likeController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/:id/like', toggleLike);

module.exports = router;
