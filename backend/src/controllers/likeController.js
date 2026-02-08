const Like = require('../models/Like');
const Post = require('../models/Post');
const { sendNotification } = require('../services/notificationService');

const toggleLike = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId).populate('userId', 'username');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const existingLike = await Like.findOne({ postId, userId });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      post.likesCount = Math.max(0, post.likesCount - 1);
      await post.save();

      return res.json({
        success: true,
        data: {
          liked: false,
          likesCount: post.likesCount,
        },
      });
    } else {
      const like = new Like({ postId, userId });
      await like.save();
      
      post.likesCount += 1;
      await post.save();

      if (post.userId._id.toString() !== userId) {
        await sendNotification(post.userId._id, {
          title: 'New Like',
          body: `${req.user.username} liked your post`,
          data: {
            type: 'like',
            postId: postId,
            userId: userId,
          },
        });
      }

      return res.json({
        success: true,
        data: {
          liked: true,
          likesCount: post.likesCount,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { toggleLike };
