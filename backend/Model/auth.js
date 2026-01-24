import { getDB } from "../utils/database.js";
import { ObjectId } from "mongodb";
export const editProfileById = async (id, bio, userName) => {
  const db = getDB();
  const user = db.collection("users").findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        bio,
        userName,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );
  return user;
};
export const editProfilePicById = async (id, imageUrl) => {
  const db = getDB();
  const user = await db.collection("users").findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        imageUrl,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );
  return user;
};
export const deleteProfilePicById = async (id) => {
  const db = getDB();
  const user = await db.collection("users").findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        imageUrl: "",
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );
  return user;
};
export const getUserForLogin = async (userName, password) => {
  const db = getDB();
  const users = db
    .collection("users")
    .findOne({ userName: userName, password: password });
  return users;
};
export const profileUser = async (id) => {
  const db = getDB();
  const user = db.collection("users").findOne({ _id: new ObjectId(id) });
  return user;
};
export const getAllUsers = async (userId, callback) => {
  const db = getDB();

  const authUser = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });

  const users = await db.collection("users").find().toArray();

  callback(users, authUser);
};
export const getAllPostsByUserId = async (userId) => {
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
  console.log(posts);
  return posts;
};
