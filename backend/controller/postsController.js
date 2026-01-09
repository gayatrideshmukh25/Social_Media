import { ObjectId } from "mongodb";
import {
  getAllPosts,
  savePost,
  deletePostById,
  editPostbyId,
  addLikesbyId,
  addCommentsToDB,
  deleteCommentFromDB,
} from "../Model/post.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.secret_key;

export const getposts = async (req, resp) => {
  const posts = await getAllPosts();
  resp.json({ success: true, posts });
};

export const createPost = async (req, resp) => {
  const { title, body, likes, dislikes, tags } = req.body;
  const token = req.cookies.token;
  const decoded = jwt.verify(token, SECRET_KEY);
  req.userId = decoded.userId;
  const userId = new ObjectId(req.userId);

  if (!token) {
    return resp.status(401).json({ message: "Not authenticated" });
  }

  const post = await savePost({ userId, title, body, likes, dislikes, tags });

  resp.json({
    success: true,
    message: "Post created successfully",
    post: post[0],
  });
};

export const editPost = async (req, resp) => {
  console.log("editing post ");
  const { title, body, tags } = req.body;
  const _id = req.params._id;
  const post = await editPostbyId(_id, title, body, tags);
  resp.json({
    success: true,
    message: "Post updated successfully",
    post: post,
  });
};

export const deletePost = async (req, resp) => {
  const _id = req.params._id;
  await deletePostById(_id);
  resp.json({ success: true, message: "Post deleted successfully" });
};

export const addLikes = async (req, resp) => {
  const id = req.params._id;
  const { userId } = req.body;
  let updatedPost = await addLikesbyId(id, userId);
  const postId = updatedPost._id;

  resp.json({
    success: true,
    message: "Like added successfully",
    postId,
    userId,
  });
};
export const addDislikes = async (req, resp) => {
  const id = req.params._id;
  const { userId } = req.body;
  let updatedPost = await addLikesbyId(id, userId);
  resp.json({
    success: true,
    message: "Dislike added successfully",
    updatedPost: updatedPost,
  });
};
export const addComments = async (req, resp) => {
  const { postId, userId, commentText } = req.body;
  console.log(postId);
  console.log(postId, userId, commentText);
  const newComment = await addCommentsToDB(postId, userId, commentText);
  resp.json({ success: true, newComment: newComment });
};
export const deleteComment = async (req, resp) => {
  const { _id, commentId } = req.body;
  const postId = req.params.id;
  const Deletedcomment = await deleteCommentFromDB(commentId, postId);
  resp.json({ success: true, Deletedcomment: Deletedcomment });
};
