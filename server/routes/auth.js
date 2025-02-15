import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import verifyToken from "../middleware/authMiddleware.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
router.post("/register", async (req, res) => {
  try {
    const { name, organizationName, email, password, userType } = req.body;

    if (!name || !organizationName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      organizationName,
      email,
      password: hashedPassword,
      userType, // userType: 'user' or 'ngo'
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User registered successfully." });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      userType: user.userType, 
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      name: user.name,
      organizationName: user.organizationName,
      userType: user.userType,
      address: user.address,
      pincode: user.pincode,
      phone: user.phone,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});
router.post('/logout', verifyToken, async (req, res) => {
  try {
    res.clearCookie('token', { httpOnly: true, secure: false });  
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Error during logout:', err);
    res.status(500).json({ error: 'Server error during logout' });
  }
});
router.post('/send-email', async (req, res) => {
  const { ngoName, ngoPhone, ngoEmail, message } = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL,
      pass:process.env.PASSWORD,
    }
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: ngoEmail,
    subject: 'Pickup Request from User',
    text: `Dear ${ngoName},\n\n${message}\n\nBest regards,\nYour App Name`
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email');
  }
});


export default router;
