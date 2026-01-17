import express from "express";
const authRouter = express.Router();
import { upload } from "../middleware/upload.js";

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
} from "../controller/authController.js";

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/checkAuth", checkAuth);
authRouter.post("/logout", logout);
authRouter.get("/myprofile", profile);
authRouter.put("/edit/profile", editProfile);
authRouter.put("/edit/profilepic", upload.single("image"), editProfilePic);
authRouter.delete("/delete/profilepic", deleteProfilePic);
authRouter.get("/profile/:id", userProfile);
authRouter.get("/allusers", allUsers);
export default authRouter;
