import express from "express";
const postRouter = express.Router();
import { upload } from "../../middleware/upload.js";
import {
  getposts,
  createPost,
  deletePost,
  addLikes,
  addDislikes,
  editPost,
  addComments,
  deleteComment,
  sendNotifications,
  getNotifications,
  acceptFollowRequest,
  followBack,
  correctedWords,
} from "./controller.js";
import verifyToken from "../../middleware/auth.js";

postRouter.get("/getPosts", verifyToken, getposts);
postRouter.post("/createPost", upload.single("image"), verifyToken, createPost);
postRouter.put("/editpost/:_id", verifyToken, editPost);
postRouter.delete("/deletePost/:_id", verifyToken, deletePost);
postRouter.put("/addLikes/:_id", verifyToken, addLikes);
postRouter.put("/addDisLikes/:_id", verifyToken, addDislikes);
postRouter.post("/addcomments", verifyToken, addComments);
postRouter.delete("/deleteComment/:id", verifyToken, deleteComment);
postRouter.post("/addFollowers", verifyToken, sendNotifications);
postRouter.get("/getNotifications", verifyToken, getNotifications);
postRouter.post("/acceptFollowRequest", verifyToken, acceptFollowRequest);
postRouter.post("/followBack", verifyToken, followBack);
postRouter.put("/correctwords", verifyToken, correctedWords);

export default postRouter;
