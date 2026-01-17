import { saveUser } from "../Model/post.js";
import { getDB } from "../utils/database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.secret_key;
import {
  editProfileById,
  profileUser,
  getUserForLogin,
  getAllUsers,
  editProfilePicById,
} from "../Model/auth.js";

export const signup = async (req, resp) => {
  try {
    const { email, password, fullName, userName, followers, following } =
      req.body;
    const user = saveUser({
      email,
      password,
      fullName,
      userName,
      followers,
      following,
    });
    if (!user) {
      resp.status(500).json({ success: false, message: "Failed to Signup" });
    }
    resp.json({ success: true, message: "user signed up", user });
  } catch (error) {
    console.log("Error", error);
    resp.staus(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const login = async (req, resp) => {
  try {
    const { userName, password } = req.body;
    const db = getDB();
    const user = await getUserForLogin(userName, password);
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
  } catch (error) {
    resp.staus(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const checkAuth = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("token is not found");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    res.json({
      message: "Welcome to profile",
      authenticated: true,
      userId: req.user.userId,
    });
  } catch (error) {
    console.error("checkAuth error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, resp) => {
  resp.clearCookie("token");
  resp.json({ success: true, message: "User logged out successfully" });
};
export const profile = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      console.log("token is not found");
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.userId;
    const foundUser = await profileUser(req.userId);
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
  try {
    const { bio, userName } = req.body;
    const token = req.cookies.token;
    if (!token) {
      console.log("NO token found");
      resp.status(401).json({ success: false, message: "No token Provided" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    const user = await editProfileById(req.userId, bio, userName);
    resp.json({ success: true, user: user });
  } catch (error) {
    console.log("error", error);
    resp.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const editProfilePic = async (req, resp) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("NO token found");
      resp.status(401).json({ success: false, message: "No token Provided" });
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    let imageUrl = "";

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`; // store relative path
    }
    const user = await editProfilePicById(req.userId, imageUrl);
    resp.json({ success: true, user: user });
  } catch (error) {
    console.log("error", error);
    resp.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const userProfile = async (req, resp) => {
  try {
    const userId = req.params.id;
    const foundUser = await profileUser(userId);

    resp.json({ success: true, user: foundUser });
  } catch (error) {
    resp.staus(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const allUsers = async (req, resp) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("NO token found");
      return resp
        .status(401)
        .json({ success: false, message: "No token Provided" });
    } else {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.userId = decoded.userId;
      await getAllUsers(req.userId, (users, authUser) => {
        resp.json({ success: true, users, authUser });
      });
    }
  } catch (error) {
    resp.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
