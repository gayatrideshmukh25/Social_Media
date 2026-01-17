import express from "express";
const postRouter = express.Router();
import { upload } from "../middleware/upload.js";
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
} from "../controller/postsController.js";

postRouter.get("/getPosts", getposts);
postRouter.post("/createPost", upload.single("image"), createPost);
postRouter.put("/editpost/:_id", editPost);
postRouter.delete("/deletePost/:_id", deletePost);
postRouter.put("/addLikes/:_id", addLikes);
postRouter.put("/addDisLikes/:_id", addDislikes);
postRouter.post("/addcomments", addComments);
postRouter.delete("/deleteComment/:id", deleteComment);
postRouter.post("/addFollowers", sendNotifications);
postRouter.get("/getNotifications", getNotifications);
postRouter.post("/acceptFollowRequest", acceptFollowRequest);
postRouter.post("/followBack", followBack);

export default postRouter;
