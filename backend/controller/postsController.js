import { ObjectId } from "mongodb";
import {
  getAllPosts,
  savePost,
  deletePostById,
  editPostbyId,
  addLikesbyId,
} from "../Model/post.js";
import { getDB } from "../utils/database.js";

export const getposts = async (req, resp) => {
  const posts = await getAllPosts();
  resp.json({ success: true, posts });
};

export const createPost = async (req, resp) => {
  const { title, body, likes, dislikes, tags } = req.body;
  const user = req.session.user;
  const { id } = user;
  const userId = new ObjectId(id);

  if (!user) {
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
  const { _id, userId, commentText } = req.body;
  console.log(_id, userId, commentText);
  const db = getDB();
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });
  const userName = user.userName;
  console.log(userName, "/////////////////////////");
  const updatedPost = await db.collection("posts").findOneAndUpdate(
    { _id: new ObjectId(_id) },
    {
      $push: {
        comments: {
          _id: new ObjectId(), // generate unique ID for the comment
          text: commentText,
          user: {
            id: new ObjectId(userId),
            userName: userName,
          },
          createdAt: new Date(),
        },
      },
    },
    { returnDocument: "after" } // return updated document
  );
  const newComment = updatedPost.comments[updatedPost.comments.length - 1];
  console.log(newComment, "!!!##############################");
  console.log(updatedPost.comments[updatedPost.comments.length - 1]);
  // const user = await db
  //   .collection("users")
  //   .findOne({ _id: new ObjectId(userId) });
  console.log(user);
  // const userName = user.userName;
  resp.json({ success: true, userName: userName, newComment: newComment });
};
