import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// ----------------------
// POST /signup
// ----------------------
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ----------------------
// POST /login
// ----------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    // Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ----------------------
// POST /request-otp
// Always returns 123456
// ----------------------
export const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // We are not saving OTP in DB for hackathon speed.
    res.json({ otp: "123456" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ----------------------
// POST /verify-otp
// Only checks if otp === 123456
// ----------------------
export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if (otp === "123456") {
      return res.json({ message: "OTP Verified" });
    }

    res.status(400).json({ message: "Invalid OTP" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
