import { saveUser } from "../Model/post.js";
import { getDB } from "../utils/database.js";
import { editProfileById } from "../Model/auth.js";
import { ObjectId } from "mongodb";

export const signup = async (req, resp) => {
  const { email, password, fullName, userName } = req.body;
  const user = saveUser({ email, password, fullName, userName });
  console.log("Signup attempt for user:", userName);
  // const db = getDB();
  // const user = await db
  //   .collection("users")
  //   .insertOne({ email, password, fullName, userName });
  // console.log("User signed up:", user);

  resp.json({ success: true, message: "user signed up", user });
};
export const login = async (req, resp) => {
  const { userName, password } = req.body;
  console.log("Login attempt for user:", userName);
  const db = getDB();
  const user = await db
    .collection("users")
    .findOne({ userName: userName, password: password });
  if (user) {
    // const user = await db.collection("users").findOne({ userName: userName });
    console.log("user id :", user._id);
    const userId = user._id;
    const id = userId.toString();
    console.log("Login successful for user:", userName);
    req.session.isAuthenticated = true;
    req.session.user = { id: id, userName: userName };
    resp.json({
      success: true,
      message: "user logged in",
      isAuthenticated: true,
      user: user,
    });
  } else {
    console.log("Login failed for user:", userName);
    await resp.status(401).json({
      success: false,
      message: "User not found or invalid credentials",
    });
  }
};
export const checkAuth = (req, res) => {
  try {
    if (!req.session) {
      return res.status(500).json({ error: "Session not initialized" });
    }

    const { isAuthenticated, user } = req.session;

    if (!isAuthenticated || !user) {
      return res.json({ authenticated: false });
    }

    res.json({
      authenticated: true,
      userId: user.id,
    });
  } catch (error) {
    console.error("checkAuth error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, resp) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session during logout:", err);
      return resp
        .status(500)
        .json({ success: false, message: "Logout failed" });
    } else {
      console.log("logouting");
      resp.json({ success: true, message: "User logged out successfully" });
    }
  });
};
export const profile = async (req, res) => {
  console.log("inside fetch profile");

  try {
    if (!req.session) {
      console.log("insdie sesssion not initialized");
      return res
        .status(500)
        .json({ success: false, message: "Session not initialized" });
    }

    const { isAuthenticated, user } = req.session;

    if (!isAuthenticated || !user) {
      console.log("not authenticated");
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const db = getDB();
    const foundUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(user.id) });

    if (!foundUser) {
      console.log("user not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user: foundUser,
    });
  } catch (error) {
    console.error("profile error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const editProfile = async (req, resp) => {
  const { bio, userName } = req.body;
  const db = getDB();
  const { id } = req.session.user;
  const user = await editProfileById(id, bio, userName);
  // const user = await db.collection("users").findOneAndUpdate(
  //   { _id: new ObjectId(id) },
  //   {
  //     $set: {
  //       bio,
  //       userName,
  //       updatedAt: new Date(),
  //     },
  //   },
  //   { returnDocument: "after" }
  // );
  resp.json({ success: true, user: user });
};
export const userProfile = async (req, resp) => {
  const userId = req.params.id;
  const db = getDB();
  const foundUser = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });
  resp.json({ success: true, user: foundUser });
};
