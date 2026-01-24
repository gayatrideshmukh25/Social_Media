import { getDB } from "../utils/database.js";
import { ObjectId } from "mongodb";

export const saveUser = async (userData) => {
  const { email, password, fullName, userName, followers, following } =
    userData;
  const db = getDB();
  const user = await db.collection("users").insertOne({
    email,
    password,
    fullName,
    userName,
    followers,
    following,
    createdAt: new Date(),
  });
  return user;
};

export const savePost = async (postData) => {
  const { userId, title, body, tags, imageUrl } = postData;

  const db = getDB();
  const result = await db.collection("posts").insertOne({
    userId,
    title,
    body,
    likes: [],
    dislikes: [],
    tags,
    imageUrl,
    createdAt: new Date(),
  });
  const _id = result.insertedId;
  const post = await db
    .collection("posts")
    .aggregate([
      { $match: { _id: _id } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ])
    .toArray();
  return post;
};

export const getAllPosts = async () => {
  const db = getDB();
  const posts = await db
    .collection("posts")
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          title: 1,
          body: 1,
          tags: 1,
          likes: 1,
          dislikes: 1,
          comments: 1,
          imageUrl: 1,
          user: {
            _id: "$user._id",
            userName: "$user.userName",
            imageUrl: "$user.imageUrl",
            bio: "$user.bio",
            following: " $user.following",
          },
        },
      },
    ])
    .toArray();
  return posts;
};
export const deletePostById = async (_id) => {
  const db = getDB();
  await db.collection("posts").deleteOne({ _id: new ObjectId(_id) });
};

export const editPostbyId = async (_id, title, body, tags) => {
  const db = getDB();
  await db.collection("posts").findOneAndUpdate(
    { _id: new ObjectId(_id) },
    {
      $set: {
        title,
        body,
        tags,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );
  const post = await db
    .collection("posts")
    .aggregate([
      { $match: { _id: new ObjectId(_id) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ])
    .toArray();
  return post;
};

export const addLikesbyId = async (id, userId, callback) => {
  const db = getDB();
  let updatedPost;
  let Msg;

  const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });

  if (post?.likes?.includes(userId)) {
    updatedPost = await db
      .collection("posts")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $pull: { likes: userId } },
        { returnDocument: "after" },
      );
    Msg = "Like removed ❌";
  } else {
    updatedPost = await db
      .collection("posts")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $addToSet: { likes: userId } },
        { returnDocument: "after" },
      );
    Msg = "Post liked ❤️";
  }

  callback(updatedPost, Msg);
};

export const adddisLikesbyId = async (id, userId, callback) => {
  const db = getDB();
  let updatedPost;
  let Msg;

  const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });

  if (post.dislikes.includes(userId)) {
    // remove dislike
    updatedPost = await db
      .collection("posts")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $pull: { dislikes: userId } },
        { returnDocument: "after" },
      );
    Msg = "Dislike removed ❌";
  } else {
    // add dislike
    updatedPost = await db
      .collection("posts")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $addToSet: { dislikes: userId } },
        { returnDocument: "after" },
      );
    Msg = "Post disliked 👎";
  }

  callback(updatedPost, Msg);
};

export const addCommentsToDB = async (_id, userId, commentText) => {
  const db = getDB();
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });
  const userName = user.userName;
  const updatedPost = await db.collection("posts").findOneAndUpdate(
    { _id: new ObjectId(_id) },
    {
      $push: {
        comments: {
          _id: new ObjectId(),
          text: commentText,
          user: {
            id: new ObjectId(userId),
            userName: userName,
          },
          createdAt: new Date(),
        },
      },
    },
    { returnDocument: "after" },
  );
  const newComment = updatedPost.comments[updatedPost.comments.length - 1];
  return newComment;
};
export const deleteCommentFromDB = async (commentId, postId) => {
  const db = getDB();
  const Deletedcomment = await db.collection("posts").updateOne(
    { _id: new ObjectId(postId) },
    {
      $pull: {
        comments: { _id: new ObjectId(commentId) },
      },
    },
  );
  return Deletedcomment;
};
export const addFollowersToUser = async (receiverId, senderId) => {
  const db = getDB();
  await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(senderId) },
      { $addToSet: { following: new ObjectId(receiverId) } },
      { returnDocument: "after" },
    );
  await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(receiverId) },
      { $addToSet: { followers: new ObjectId(senderId) } },
      { returnDocument: "after" },
    );

  return true;
};
export const getNotificationsOfCurrentUser = async (receiverId) => {
  const db = getDB();
  const noti = await db
    .collection("notifications")
    .findOne({ receiverId: new ObjectId(receiverId) });
  const notifications = await db
    .collection("notifications")
    .aggregate([
      {
        $match: {
          receiverId: new ObjectId(receiverId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: {
          path: "$sender",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          message: 1,
          type: 1,
          isRead: 1,
          createdAt: 1,
          status: 1,
          sender: {
            _id: 1,
            userName: 1,
          },
        },
      },
    ])
    .toArray();

  return notifications;
};
export const acceptRequest = async (
  receiverId,
  senderId,
  notificationId,
  callback,
) => {
  const db = getDB();
  await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(receiverId) },
      { $addToSet: { followers: new ObjectId(senderId) } },
      { returnDocument: "after" },
    );
  await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(senderId) },
      { $addToSet: { following: new ObjectId(receiverId) } },
      { returnDocument: "after" },
    );
  await db.collection("notifications").updateOne(
    { _id: new ObjectId(notificationId) },
    {
      $set: {
        isRead: true,
        status: "accepted",
      },
    },
  );
  callback();
};
export const followBackToFollow = async (
  receiverId,
  senderId,
  notificationId,
  callback,
) => {
  const db = getDB();
  const notifications = await db.collection("notifications").updateOne(
    { _id: new ObjectId(notificationId) },
    {
      $set: {
        isRead: true,
        status: "Requested_back",
      },
    },
  );
  await db.collection("notifications").insertOne({
    receiverId: new ObjectId(receiverId),
    senderId: new ObjectId(senderId),
    type: "Follow_Back",
    message: "followed you back",
    status: "pending",
    isRead: false,
    createdAt: new Date(),
  });
};
