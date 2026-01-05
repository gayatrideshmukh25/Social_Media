import express from "express";
const app = express();
import mongoConnect, { getDB } from "./utils/database.js";
import postRouter from "./router/postRouter.js";
import authRouter from "./router/authRouter.js";
import session from "express-session";
// import MongoDBStore from "connect-mongodb-session";
import connectMongoDBSession from "connect-mongodb-session";
import cookieParser from "cookie-parser";
app.use(cookieParser());

const MongoDBStore = connectMongoDBSession(session);
import cors from "cors";

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const store = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017/SocialMedia",
  collection: "sessions",
});
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// app.use((req, resp, next) => {
//   req.isAuthenticated = req.session ? req.session.isAuthenticated : false;
//   console.log("Session Object", req.session);
//   next();
// });

app.use("/api", postRouter);
app.use("/api", authRouter);
const Port = 3000; // ✅ declare first

mongoConnect(() => {
  app.listen(Port, () => {
    console.log(`http://localhost:${Port}`);
  });
});
