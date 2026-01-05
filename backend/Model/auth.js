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
    { returnDocument: "after" }
  );
  return user;
};
