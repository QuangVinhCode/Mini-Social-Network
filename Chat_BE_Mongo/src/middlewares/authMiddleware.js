import jwt from "jsonwebtoken";
import { isTokenValid } from "../config/tokenMap.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token không tồn tại." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    console.log(token);
    if (!isTokenValid(decoded.userId, token)) {
      return res.status(402).json({ message: "Token không thuộc về user." });
    }
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token không hợp lệ." });
  }
};
