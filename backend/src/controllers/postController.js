const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const User = require('../models/User');

const createPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    const post = new Post({
      userId,
      text,
    });

    await post.save();

    res.status(201).json({
      success: true,
      data: {
        post: {
          id: post._id,
          userId: post.userId,
          text: post.text,
          likesCount: post.likesCount,
          commentsCount: post.commentsCount,
          username: req.user.username,
          displayName: req.user.displayName,
          createdAt: post.createdAt,
          likedByUser: false,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const username = req.query.username;
    const skip = (page - 1) * limit;

    let query = {};
    if (username) {
      const user = await User.findOne({ username });
      if (user) {
        query.userId = user._id;
      } else {
        return res.json({
          success: true,
          data: {
            posts: [],
            pagination: {
              currentPage: page,
              totalPages: 0,
              totalItems: 0,
              hasMore: false,
            },
          },
        });
      }
    }

    const totalItems = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username displayName')
      .lean();

    const postIds = posts.map(p => p._id);
    const userLikes = await Like.find({
      postId: { $in: postIds },
      userId: req.user.id,
    }).lean();

    const likedPostIds = new Set(userLikes.map(like => like.postId.toString()));

    const commentsMap = {};
    const allComments = await Comment.find({
      postId: { $in: postIds },
    })
      .sort({ createdAt: -1 })
      .limit(postIds.length * 3)
      .populate('userId', 'username displayName')
      .lean();

    allComments.forEach(comment => {
      const postIdStr = comment.postId.toString();
      if (!commentsMap[postIdStr]) {
        commentsMap[postIdStr] = [];
      }
      if (commentsMap[postIdStr].length < 3) {
        commentsMap[postIdStr].push({
          id: comment._id,
          userId: comment.userId._id,
          username: comment.userId.username,
          displayName: comment.userId.displayName,
          text: comment.text,
          createdAt: comment.createdAt,
        });
      }
    });

    const formattedPosts = posts.map(post => ({
      id: post._id,
      userId: post.userId._id,
      text: post.text,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      username: post.userId.username,
      displayName: post.userId.displayName,
      createdAt: post.createdAt,
      likedByUser: likedPostIds.has(post._id.toString()),
      comments: commentsMap[post._id.toString()] || [],
    }));

    res.json({
      success: true,
      data: {
        posts: formattedPosts,
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

const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate('userId', 'username displayName').lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const like = await Like.findOne({
      postId: id,
      userId: req.user.id,
    });

    const comments = await Comment.find({ postId: id })
      .sort({ createdAt: -1 })
      .limit(10)
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
        post: {
          id: post._id,
          userId: post.userId._id,
          text: post.text,
          likesCount: post.likesCount,
          commentsCount: post.commentsCount,
          username: post.userId.username,
          displayName: post.userId.displayName,
          createdAt: post.createdAt,
          likedByUser: !!like,
          comments: formattedComments,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post',
      });
    }

    await Post.findByIdAndDelete(id);

    await Promise.all([
      Like.deleteMany({ postId: id }),
      Comment.deleteMany({ postId: id }),
    ]);

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPost, getPosts, getPost, deletePost };
