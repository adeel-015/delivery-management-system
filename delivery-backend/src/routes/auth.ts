import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/register",
  body("name").isString().notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("role").isIn(["buyer", "seller", "admin"]),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { name, email, password, role } = req.body;
    try {
      const existing = await User.findOne({ email });
      if (existing)
        return res.status(400).json({ message: "Email already registered" });
      const user = new User({ name, email, password, role });
      await user.save();
      return res.json({ message: "User registered" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "Invalid credentials" });
      const match = await user.comparePassword(password);
      if (!match)
        return res.status(400).json({ message: "Invalid credentials" });
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not set; cannot sign token");
        return res
          .status(500)
          .json({ message: "Server configuration error: JWT secret missing" });
      }
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );
      const userObj = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      return res.json({ token, user: userObj });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
