const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const { sendNotification } = require('../services/notificationService');

const addComment = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId).populate('userId', 'username');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = new Comment({
      postId,
      userId,
      text,
    });

    await comment.save();

    post.commentsCount += 1;
    await post.save();

    if (post.userId._id.toString() !== userId) {
      await sendNotification(post.userId._id, {
        title: 'New Comment',
        body: `${req.user.username} commented on your post`,
        data: {
          type: 'comment',
          postId: postId,
          commentId: comment._id.toString(),
          userId: userId,
        },
      });
    }

    res.status(201).json({
      success: true,
      data: {
        comment: {
          id: comment._id,
          postId: comment.postId,
          userId: comment.userId,
          username: req.user.username,
          displayName: req.user.displayName,
          text: comment.text,
          createdAt: comment.createdAt,
        },
        commentsCount: post.commentsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const totalItems = await Comment.countDocuments({ postId });
    const totalPages = Math.ceil(totalItems / limit);

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username displayName')
      .lean();

    const formattedComments = comments.map(comment => ({
      id: comment._id,
      userId: comment.userId._id,
      username: comment.userId.username,
      displayName: comment.userId.displayName,
      text: comment.text,
      createdAt: comment.createdAt,
    }));

    res.json({
      success: true,
      data: {
        comments: formattedComments,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          hasMore: page < totalPages,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getComments };
