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
  try {
    const { title, body, likes, dislikes, tags } = req.body;
    const token = req.cookies.token;
    if (!token) {
      return resp.status(401).json({ message: "Not authenticated" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return resp.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    const userId = new ObjectId(decoded.userId);
    const post = await savePost({ userId, title, body, likes, dislikes, tags });
    if (!post) {
      resp
        .status(500)
        .json({ success: false, message: "Failed to  Create post" });
    }

    resp.json({
      success: true,
      message: "Post created successfully",
      post: post[0],
    });
  } catch (error) {
    console.log("create post error : ", error);
    resp.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const editPost = async (req, resp) => {
  try {
    const { title, body, tags } = req.body;
    const _id = req.params._id;
    const post = await editPostbyId(_id, title, body, tags);
    if (!post) {
      resp.status(500).json({ success: false, message: "Failed to edit post" });
    }
    resp.json({
      success: true,
      message: "Post updated successfully",
      post: post,
    });
  } catch (error) {
    resp.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const deletePost = async (req, resp) => {
  try {
    const _id = req.params._id;
    await deletePostById(_id);
    resp.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    resp.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const addLikes = async (req, resp) => {
  try {
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
  } catch (error) {
    resp.staus(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const addDislikes = async (req, resp) => {
  try {
    const id = req.params._id;
    const { userId } = req.body;
    let updatedPost = await addLikesbyId(id, userId);
    resp.json({
      success: true,
      message: "Dislike added successfully",
      updatedPost: updatedPost,
    });
  } catch (error) {
    resp.staus(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const addComments = async (req, resp) => {
  try {
    const { postId, userId, commentText } = req.body;
    console.log(postId);
    console.log(postId, userId, commentText);
    const newComment = await addCommentsToDB(postId, userId, commentText);
    resp.json({ success: true, newComment: newComment });
  } catch (error) {
    resp.staus(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const deleteComment = async (req, resp) => {
  try {
    const { _id, commentId } = req.body;
    const postId = req.params.id;
    const Deletedcomment = await deleteCommentFromDB(commentId, postId);
    resp.json({ success: true, Deletedcomment: Deletedcomment });
  } catch (error) {
    resp.staus(500).json({ success: false, message: "Internal Server Error" });
  }
};
