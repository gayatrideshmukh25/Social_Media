import { getDB } from "../utils/database.js";
import { ObjectId } from "mongodb";
// class POST {
//   constructor(title, body, reactions, tags) {
//     this.title = title;
//     this.body = body;
//     this.reactions = reactions;
//     this.tags = tags;
//   }
//   static save() {
//     console.log("Post saved");
//     const db = getDB();
//     db.collection("posts").insertOne({
//       title: this.title,
//       body: this.body,
//       reactions: this.reactions,
//       tags: this.tags,
//     });
//   }
//   getAllPosts(callback) {
//     const db = getDB();
//     const posts = db.collection("posts").find().toArray();
//     callback(posts);
//   }
// }
// export default POST;
export const saveUser = async (userData) => {
  const { email, password, fullName, userName } = userData;
  const db = getDB();
  const user = await db
    .collection("users")
    .insertOne({ email, password, fullName, userName, createdAt: new Date() });
  console.log("User saved:", user);
  return user;
};

export const savePost = async (postData) => {
  const { userId, title, body, likes, dislikes, tags } = postData;

  const db = getDB();
  const result = await db.collection("posts").insertOne({
    userId,
    title,
    body,
    likes,
    dislikes,
    tags,
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
  console.log("Post saved:", post);
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
          user: {
            _id: "$user._id",
            userName: "$user.userName",
          },
        },
      },
    ])
    .toArray();
  console.log("getted posts are here ", posts.value);
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
    { returnDocument: "after" }
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

export const addLikesbyId = async (id, userId) => {
  const db = getDB();
  let updatedPost;
  const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });
  if (post.likes.includes(userId)) {
    updatedPost = await db
      .collection("posts")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $pull: { likes: userId } },
        { returnDocument: "after" }
      );
  } else {
    updatedPost = await db
      .collection("posts")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $addToSet: { likes: userId } },
        { returnDocument: "after" }
      );
  }
  return updatedPost;
};
export const adddisLikesbyId = async (id, userId) => {
  const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });
  let updatedPost;
  if (post.dislikes.includes(userId)) {
    updatedPost = await db
      .collection("posts")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $pull: { dislikes: userId } },
        { returnDocument: "after" }
      );
  } else {
    updatedPost = await db
      .collection("posts")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $addToSet: { dislikes: userId } },
        { returnDocument: "after" }
      );
  }
  return updatedPost;
};
