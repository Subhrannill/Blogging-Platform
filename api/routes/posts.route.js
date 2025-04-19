// routes/posts.js
const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} = require('../controllers/post.controller');
const uploadMiddleware = require('../lib/multer');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, uploadMiddleware.single('file'), createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.put('/', verifyToken, uploadMiddleware.single('file'), updatePost);
router.delete('/:id', deletePost);

module.exports = router;
