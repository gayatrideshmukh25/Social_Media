import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoConnect, { getDB } from "./utils/database.js";
import postRouter from "./router/postRouter.js";
import authRouter from "./router/authRouter.js";
import cookieParser from "cookie-parser";
app.use(cookieParser());

import cors from "cors";
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api", postRouter);
app.use("/api", authRouter);
const Port = 3000;

mongoConnect(() => {
  app.listen(Port, () => {
    console.log(`http://localhost:${Port}`);
  });
});
