import express from "express";
const postRouter = express.Router();
import {
  getposts,
  createPost,
  deletePost,
  addLikes,
  addDislikes,
  editPost,
} from "../controller/postsController.js";

postRouter.get("/getPosts", getposts);
postRouter.post("/createPost", createPost);
postRouter.put("/editpost/:_id", editPost);
postRouter.delete("/deletePost/:_id", deletePost);
postRouter.put("/addLikes/:_id", addLikes);
postRouter.put("/addDisLikes/:_id", addDislikes);

// postRouter.post("/signup", signup);
// postRouter.post("/login", login);
// postRouter.get("/checkAuth", checkAuth);
// postRouter.post("/logout", logout);

export default postRouter;
