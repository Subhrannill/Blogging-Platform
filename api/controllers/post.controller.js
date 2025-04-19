const fs = require('fs');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const cloudinary = require('../lib/cloudinary');

const createPost = async (req, res) => {
  // Validate required fields
  const { title, summary, content } = req.body;
  if (!title || !summary || !content) {
    return res
      .status(400)
      .json({ error: 'Title, summary, and content are required' });
  }

  // Check if file exists
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    fs.unlinkSync(req.file.path);
    return res
      .status(400)
      .json({ error: 'Only JPEG, PNG, or WebP images are allowed' });
  }

  // Validate file size
  const maxSize = 5 * 1024 * 1024;
  if (req.file.size > maxSize) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'Image file too large (max 5MB)' });
  }

  // Verify JWT token
  const { token } = req.cookies;
  let userInfo;
  try {
    userInfo = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    fs.unlinkSync(req.file.path);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    // Upload to Cloudinary with optimizations
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blog-posts',
      resource_type: 'auto',
      quality: 'auto:good',
      width: 1200,
      crop: 'limit',
      format: 'webp',
    });

    // Create post in database
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: {
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        format: cloudinaryResult.format,
      },
      author: userInfo.id,
    });

    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      post: postDoc,
      message: 'Post created successfully',
    });
  } catch (error) {
    console.error('Post creation error:', error);

    // Clean up temp file if it exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Delete from Cloudinary if upload succeeded but DB failed
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create post',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const getPosts = async (req, res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20)
  );
};

const getPost = async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
};

const updatePost = async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);

      // Verify author
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(403).json({ error: 'You are not the author' });
      }

      let coverUpdate = {};

      // If new image was uploaded
      if (req.file) {
        try {
          // First upload new image to Cloudinary
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'blog-posts',
            resource_type: 'auto',
            quality: 'auto:good',
            width: 1200,
            crop: 'limit',
          });

          // Store new image info
          coverUpdate = {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          };

          // Delete old image from Cloudinary if it exists
          if (postDoc.cover?.publicId) {
            await cloudinary.uploader
              .destroy(postDoc.cover.publicId)
              .catch(error =>
                console.error('Error deleting old image:', error)
              );
          }

          // Delete the temporary file
          fs.unlinkSync(req.file.path);
        } catch (uploadError) {
          // Clean up temp file if upload fails
          if (req.file?.path) fs.unlinkSync(req.file.path);
          console.error('Cloudinary upload error:', uploadError);
          return res.status(500).json({ error: 'Image upload failed' });
        }
      }

      // Update the post
      postDoc.set({
        title,
        summary,
        content,
        cover: req.file ? coverUpdate : postDoc.cover,
      });

      await postDoc.save();
      res.json(postDoc);
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete Post (new functionality)
const deletePost = async (req, res) => {
  try {
    // Get token from either cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { id } = req.params;
    const postDoc = await Post.findById(id);

    if (!postDoc) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Post not found',
      });
    }

    // Verify author
    if (postDoc.author.toString() !== decoded.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not authorized to delete this post',
      });
    }

    // Delete from Cloudinary
    if (postDoc.cover?.publicId) {
      await cloudinary.uploader
        .destroy(postDoc.cover.publicId)
        .catch(err => console.error('Cloudinary deletion error:', err));
    }

    // Delete from database
    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      deletedId: id,
    });
  } catch (error) {
    console.error('Delete post error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid Token',
        message: 'Authentication failed',
      });
    }

    return res.status(500).json({
      error: 'Server Error',
      message: error.message || 'Internal server error',
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
