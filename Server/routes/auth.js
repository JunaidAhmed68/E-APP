import express from "express";
import Joi from "joi";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import nodemailer from "nodemailer";

let route = express.Router();

const registerSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "dev"] } })
    .required(),
  password: Joi.string().min(6).required(),
  age: Joi.number().strict().integer().min(1).required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "dev"] } })
    .required(),
  password: Joi.string().min(6).required(),
});

route.post("/signup", async (req, res) => {
  try {
    const { username, email, age, password } = req.body;

    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }

    let findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(400).json({
        error: true,
        message: "User already exists with this email!",
      });
    }

    // bcrypt password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // create user
    let newUser = new User({
      username,
      email,
      age,
      password: hashPassword,
    });
    newUser = await newUser.save();
    res.status(200).json({
      error: false,
      message: "User registered successfully!",
      data: newUser,
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error!",
    });
  }
});

route.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }

    // find user by email
    let findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(400).json({
        error: true,
        message: "User not found with this email!",
      });
    }
    // compare password
    const isPasswordValid = await bcrypt.compare(password, findUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: true,
        message: "Invalid credentials!",
      });
    }
    if (findUser.isEmailVerified === false) {
    return res.status(403).json({ message: "Email not verified" });
  }
    // create jwt token
    let token = jwt.sign(
      {
        username: findUser.username,
        email: findUser.email,
        age: findUser.age,
        _id: findUser._id,
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      error: false,
      message: "User logged in successfully!",
      user: {
        username: findUser.username,
        email: findUser.email,
        age: findUser.age,
        _id: findUser._id,
        isEmailVerified: findUser.isEmailVerified,
      },
      token: token,
    });
  } catch (error) {
    console.error("Error in user login:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error!",
    });
  }
});

route.get("/user", (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      error: true,
      message: "Token not provided, please login first!",
    });
  }
  const token = req.headers.authorization.split(" ")[1];

  let decodedUser = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedUser) {
    return res.status(401).json({
      error: true,
      message: "Invalid token!",
    });
  }
  res.status(200).json({
    error: false,
    message: "User data fetched successfully!",
    data: decodedUser,
  });
});



// FORGOT PASSWORD
route.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found with this email!",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"MyApp Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password. It expires in 15 minutes:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    return res.status(200).json({
      error: false,
      message: "Password reset email sent!",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error!",
    });
  }
});

// RESET PASSWORD
route.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      error: false,
      message: "Password reset successful!",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      error: true,
      message: "Invalid or expired token!",
    });
  }
});

export default route;
