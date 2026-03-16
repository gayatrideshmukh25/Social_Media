// import { saveUser } from "./model.js";
import { getDB } from "../.././utils/database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.secret_key;
import {
  editProfileById,
  profileUser,
  getUserForLogin,
  getAllUsers,
  editProfilePicById,
  deleteProfilePicById,
  getAllPostsByUserId,
} from "./model.js";

export const signup = async (req, resp) => {
  try {
    const { email, password, fullName, userName, followers, following } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = saveUser({
      email,
      password: hashedPassword,
      fullName,
      userName,
      followers,
      following,
    });
    if (!user) {
      resp.status(500).json({ success: false, message: "Failed to Signup" });
    }
    resp.json({ success: true, message: "user signed up" });
  } catch (error) {
    next(error);
  }
};
export const login = async (req, resp) => {
  try {
    const { userName, password } = req.body;
    const db = getDB();
    const user = await getUserForLogin(userName);
    if (!user) {
      return resp.status(401).json({
        success: false,
        message: "User not found or invalid credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return resp.status(401).json({
        success: false,
        message: "User not found or invalid credentials",
      });
    }
    if (user) {
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
        expiresIn: "1h",
      });
      resp.cookie("token", token, {
        httpOnly: true,
        secure: false,
      });
      resp.json({
        success: true,
        message: "user logged in",
        token: token,
        isAuthenticated: true,
        user: user._id,
      });
    } else {
      console.log("Login failed for user:", userName);
      await resp.status(401).json({
        success: false,
        message: "User not found or invalid credentials",
      });
    }
  } catch (error) {
    next(error);
  }
};
export const checkAuth = (req, res, next) => {
  res.json({
    message: "Welcome to profile",
    authenticated: true,
    userId: req.user.userId,
  });
};

export const logout = async (req, resp) => {
  resp.clearCookie("token");
  resp.json({ success: true, message: "User logged out successfully" });
};
export const profile = async (req, res) => {
  try {
    const foundUser = await profileUser(req.user.userId);
    const posts = await getAllPostsByUserId(req.user.userId);
    const postsCount = posts.length;
    if (!foundUser) {
      console.log("user not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user: foundUser,
      postsCount: postsCount,
      posts,
    });
  } catch (error) {
    console.error("profile error:", error);
    next(error);
  }
};

export const editProfile = async (req, resp) => {
  try {
    const { bio, userName } = req.body;

    const user = await editProfileById(req.user.userId, bio, userName);
    resp.json({ success: true, user: user });
  } catch (error) {
    next(error);
  }
};
export const editProfilePic = async (req, resp) => {
  try {
    let imageUrl = "";

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    const user = await editProfilePicById(req.user.userId, imageUrl);
    resp.json({ success: true, user: user });
  } catch (error) {
    next(error);
  }
};
export const deleteProfilePic = async (req, resp) => {
  try {
    const user = await deleteProfilePicById(req.user.userId);
    resp.json({ success: true, user: user });
  } catch (error) {
    next(error);
  }
};
export const userProfile = async (req, resp) => {
  try {
    const userId = req.params.id;
    const foundUser = await profileUser(userId);

    resp.json({ success: true, user: foundUser });
  } catch (error) {
    next(error);
  }
};
export const allUsers = async (req, resp) => {
  try {
    const token = req.cookies.token;
    await getAllUsers(req.user.userId, (users, authUser) => {
      resp.json({ success: true, users, authUser });
    });
  } catch (error) {
    next(error);
  }
};
