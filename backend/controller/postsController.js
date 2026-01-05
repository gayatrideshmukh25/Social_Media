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
  const db = getDB();
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
  // const _id = result.insertedId;
  // const post = await db
  //   .collection("posts")
  //   .aggregate([
  //     { $match: { _id: _id } },
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "userId",
  //         foreignField: "_id",
  //         as: "user",
  //       },
  //     },
  //     { $unwind: "$user" },
  //   ])
  //   .toArray();

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
  // const db = getDB();
  const post = await editPostbyId(_id, title, body, tags);
  // await db.collection("posts").findOneAndUpdate(
  //   { _id: new ObjectId(_id) },
  //   {
  //     $set: {
  //       title,
  //       body,
  //       tags,
  //       updatedAt: new Date(),
  //     },
  //   },
  //   { returnDocument: "after" }
  // );
  // const post = await db
  //   .collection("posts")
  //   .aggregate([
  //     { $match: { _id: new ObjectId(_id) } },
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "userId",
  //         foreignField: "_id",
  //         as: "user",
  //       },
  //     },
  //     { $unwind: "$user" },
  //   ])
  //   .toArray();

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
  const db = getDB();
  const id = req.params._id;
  const { userId } = req.body;
  let updatedPost = await addLikesbyId(id, userId);
  // let updatedPost;
  // const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });
  // if (post.likes.includes(userId)) {
  //   updatedPost = await db
  //     .collection("posts")
  //     .findOneAndUpdate(
  //       { _id: new ObjectId(id) },
  //       { $pull: { likes: userId } },
  //       { returnDocument: "after" }
  //     );
  // } else {
  //   updatedPost = await db
  //     .collection("posts")
  //     .findOneAndUpdate(
  //       { _id: new ObjectId(id) },
  //       { $addToSet: { likes: userId } },
  //       { returnDocument: "after" }
  //     );
  // }
  const postId = updatedPost._id;
  // const userId = updatedPost.userId;

  resp.json({
    success: true,
    message: "Like added successfully",
    postId,
    userId,
    // updatedPost: updatedPost,
  });
};
export const addDislikes = async (req, resp) => {
  const db = getDB();
  const id = req.params._id;
  const { userId } = req.body;
  let updatedPost = await addLikesbyId(id, userId);
  // const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });
  // let updatedPost;
  // if (post.dislikes.includes(userId)) {
  //   updatedPost = await db
  //     .collection("posts")
  //     .findOneAndUpdate(
  //       { _id: new ObjectId(id) },
  //       { $pull: { dislikes: userId } },
  //       { returnDocument: "after" }
  //     );
  // } else {
  //   updatedPost = await db
  //     .collection("posts")
  //     .findOneAndUpdate(
  //       { _id: new ObjectId(id) },
  //       { $addToSet: { dislikes: userId } },
  //       { returnDocument: "after" }
  //     );
  // }
  resp.json({
    success: true,
    message: "Dislike added successfully",
    updatedPost: updatedPost,
  });
};
