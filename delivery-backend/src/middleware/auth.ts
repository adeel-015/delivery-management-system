import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "No token provided" });
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET as string;
    const payload: any = jwt.verify(token, secret);
    const user = await User.findById(payload.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user as any;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
};
