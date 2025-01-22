import express from "express";
import verifyToken from "../utils/verifyUser.js";
import createPost, {
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";

const postRouter = express.Router();

postRouter.post("/create-post", verifyToken, createPost);
postRouter.get("/get-posts", getPosts);
postRouter.delete("/delete-post/:postId/:userId", verifyToken, deletePost);
postRouter.put("/update-post/:postId/:userId", verifyToken, updatePost);

export default postRouter;
