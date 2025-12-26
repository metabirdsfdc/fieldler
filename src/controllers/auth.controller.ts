import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

export const signup = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword
  });

  const token = signToken({ email: user.email });

  res.status(201).json({
    message: "Signup successful",
    data: {
      accessToken: token,
      user: {
        fullName: user.fullName,
        email: user.email
      }
    }
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({ email: user.email });

  res.json({
    message: "Login successful",
    data: {
      accessToken: token,
      user: {
        fullName: user.fullName,
        email: user.email
      }
    }
  });
};
