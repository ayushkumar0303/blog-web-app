import Comment from "../models/comment.model.js";

const addComment = async (req, res) => {
  const { content, userId, postId } = req.body;

  if (userId !== req.user.id) {
    return res.status(400).json("You are not allowed to add this comment");
  }
  const newComment = new Comment({
    content,
    userId,
    postId,
  });

  await newComment.save();
  return res.status(200).json(newComment);
};

export const getComments = async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId }).sort({
    createdAt: -1,
  });
  return res.status(200).json(comments);
};

export const likeComment = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  const userIndex = comment.likes.indexOf(req.user.id);
  if (userIndex == -1) {
    comment.likesCount += 1;
    comment.likes.push(req.user.id);
  } else {
    comment.likesCount -= 1;
    comment.likes.splice(userIndex, 1);
  }
  await comment.save();
  return res.status(200).json(comment);
};

export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return res.status(400).json("No comment found");
  }
  const userId = comment.userId;
  if (!req.user.isAdmin && req.user.id !== userId) {
    return res.status(400).json("you are not allowed to delete this comment");
  }
  try {
    await Comment.findByIdAndDelete(req.params.commentId);
    return res.status(200).json("this comment is deleted");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(400).json("Comment not found");
    }

    if (!req.user.isAdmin && req.user.id !== comment.userId) {
      return res.status(400).json("You are not allowed to edit this comment");
    }

    const updateComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );

    return res.status(200).json(updateComment);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const getAllComments = async (req, res) => {
  // console.log(req.user);
  if (!req.user.isAdmin) {
    return res.status(400).json("You are not allowed to get all comments");
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;
    const comments = await Comment.find()
      .sort({
        createdAt: sortDirection,
      })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgoDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    // console.log(oneMonthAgoDate);
    const oneMonthAgoComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgoDate },
    });
    // console.log(oneMonthAgoComments);
    return res
      .status(200)
      .json({ comments, totalComments, oneMonthAgoComments });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
export default addComment;
