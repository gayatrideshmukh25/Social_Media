import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = process.env.secret_key;

const verifyToken = (req, resp, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("No token provided");
      return resp.status(401).json({ success: false, message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return resp.status(401).json({ success: false, message: "Invalid token" });
  }
};
export default verifyToken;
