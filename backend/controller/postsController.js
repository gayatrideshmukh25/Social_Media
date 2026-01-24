import { ObjectId } from "mongodb";
import {
  getAllPosts,
  savePost,
  deletePostById,
  editPostbyId,
  addLikesbyId,
  adddisLikesbyId,
  addCommentsToDB,
  deleteCommentFromDB,
  addFollowersToUser,
  getNotificationsOfCurrentUser,
  acceptRequest,
  followBackToFollow,
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
    const { title, body } = req.body;
    const tags = req.body.tags
      ? req.body.tags
          .split(" ")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];
    const token = req.cookies.token;
    if (!token) {
      return resp.status(401).json({ message: "Not authenticated" });
    }
    let imageUrl = "";

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`; // store relative path
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
    const post = await savePost({
      userId,
      title,
      body,
      tags,
      imageUrl,
    });
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
    console.log("error", error);
    resp.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const deletePost = async (req, resp) => {
  try {
    const _id = req.params._id;
    await deletePostById(_id);
    resp.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const addLikes = async (req, resp) => {
  try {
    const id = req.params._id;
    const { userId } = req.body;
    let postId;

    await addLikesbyId(id, userId, (updatedPost, Msg) => {
      postId = updatedPost._id;
      resp.json({
        success: true,
        message: "Like added successfully",
        postId,
        userId,
        Msg,
      });
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const addDislikes = async (req, resp) => {
  try {
    const id = req.params._id;
    const { userId } = req.body;
    await adddisLikesbyId(id, userId, (updatedPost, Msg) => {
      let postId = updatedPost._id;
      resp.json({
        success: true,
        message: "Dislike added successfully",
        updatedPost: updatedPost,
        userId,
        postId,
        msg: Msg,
      });
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const addComments = async (req, resp) => {
  try {
    const { postId, userId, commentText } = req.body;
    const newComment = await addCommentsToDB(postId, userId, commentText);
    resp.json({ success: true, newComment: newComment });
  } catch (error) {
    resp.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const deleteComment = async (req, resp) => {
  try {
    const { _id } = req.body;
    const commentId = req.params.id;
    const Deletedcomment = await deleteCommentFromDB(commentId, _id);
    resp.json({ success: true, Deletedcomment: Deletedcomment });
  } catch (error) {
    resp.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const sendNotifications = async (req, resp) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("token is not found");
      return resp.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    const { receiverId } = req.body;
    const senderId = req.user.userId;
    await addFollowersToUser(receiverId, senderId);
    resp.json({ success: true, message: "request Sent" });
  } catch (error) {
    resp.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const getNotifications = async (req, resp) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("token is not found");
      return resp.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    const notifications = await getNotificationsOfCurrentUser(req.user.userId);
    resp.json({ notifications: notifications, success: true });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const acceptFollowRequest = async (req, resp) => {
  try {
    const { senderId, notificationId } = req.body;
    const token = req.cookies.token;
    if (!token) {
      console.log("token is not found");
      return resp.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    await acceptRequest(req.user.userId, senderId, notificationId, () => {
      resp.json({ success: true, message: "request Accepted" });
    });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const followBack = async (req, resp) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("token is not found");
      return resp.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    const { receiverId, notificationId } = req.body;
    const senderId = req.user.userId;
    await followBackToFollow(receiverId, senderId, notificationId, () => {
      resp.json({ success: true, message: "request Sent" });
    });
  } catch (error) {
    console.log("error", error);
    resp.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
