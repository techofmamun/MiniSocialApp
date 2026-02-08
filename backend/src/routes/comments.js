const express = require('express');
const router = express.Router();
const { addComment, getComments } = require('../controllers/commentController');
const { validate } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/:id/comment', validate('createComment'), addComment);
router.get('/:id/comments', getComments);

module.exports = router;
