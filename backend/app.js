import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoConnect, { getDB } from "./src/utils/database.js";
import postRouter from "./src/apis/post/routes.js";
import authRouter from "./src/apis/auth/routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./src/middleware/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url";
app.use(cookieParser());

import cors from "cors";

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", postRouter);
app.use("/api", authRouter);
app.use(errorHandler);
const Port = 3000;

mongoConnect(() => {
  app.listen(Port, () => {
    console.log(`http://localhost:${Port}`);
  });
});
