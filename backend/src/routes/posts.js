const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPost, deletePost } = require('../controllers/postController');
const { validate } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', validate('createPost'), createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.delete('/:id', deletePost);

module.exports = router;
