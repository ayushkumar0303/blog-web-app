import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cors from "cors";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import path from "path";

const app = express();

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your front-end URL
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

app.listen(3000, (req, res) => {
  console.log("Server is running on port 3000");
});

app.use("/server/user", userRouter);
app.use("/server/auth", authRouter);
app.use("/server/post", postRouter);
app.use("/server/comment", commentRouter);
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
