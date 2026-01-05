import express from "express";
const authRouter = express.Router();
// import {
//   getposts,
//   createPost,
//   deletePost,
//   addLikes,
//   addDislikes,
//   editPost,
//   profile,
//   editProfile,
// } from "../controller/postsController.js";
import {
  profile,
  editProfile,
  signup,
  login,
  checkAuth,
  logout,
  userProfile,
} from "../controller/authController.js";

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/checkAuth", checkAuth);
authRouter.post("/logout", logout);
authRouter.get("/myprofile", profile);
authRouter.put("/edit/profile", editProfile);
authRouter.get("/profile/:id", userProfile);
export default authRouter;
