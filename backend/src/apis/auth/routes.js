import express from "express";
const authRouter = express.Router();
import { upload } from "../../middleware/upload.js";

import {
  profile,
  editProfile,
  signup,
  login,
  checkAuth,
  logout,
  userProfile,
  allUsers,
  editProfilePic,
  deleteProfilePic,
} from "./controller.js";
import verifyToken from "../../middleware/auth.js";

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/checkAuth", verifyToken, checkAuth);
authRouter.post("/logout", logout);
authRouter.get("/myprofile", verifyToken, profile);
authRouter.put("/edit/profile", verifyToken, editProfile);
authRouter.put(
  "/edit/profilepic",
  upload.single("image"),
  verifyToken,
  editProfilePic,
);
authRouter.delete("/delete/profilepic", verifyToken, deleteProfilePic);
authRouter.get("/profile/:id", userProfile);
authRouter.get("/allusers", verifyToken, allUsers);
export default authRouter;
