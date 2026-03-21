import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import Book from "../models/Book.js";
import Request from "../models/Request.js";
import { OAuth2Client } from "google-auth-library";

export const registerUser = async(req, res) => {
  try{
    const {name, email, password, phone} = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "All fields including phone number are required"
      });
    }

    const userExists = await User.findOne({email});
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        authProvider: "local"
    });

    res.status(201).json({_id: user._id,name: user.name,email: user.email, token: generateToken(user._id),});
  }catch(error){
    res.status(500).json({ message: "Registration failed" });
  }
}

export const loginUser = async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({_id: user._id,name: user.name,email: user.email,token: generateToken(user._id),});
}

//google 
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture: avatar } = payload;

    let user = await User.findOne({ email });

    if (user && user.authProvider === "local") {
      return res.status(400).json({
        message: "Email already registered with password login",
      });
    }

    if (!user) {
      user = await User.create({
        name,
        email,
        authProvider: "google",
        googleId,
        avatar,
      });
    }

    const jwtToken = generateToken(user._id);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider,
      },
      token: jwtToken,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Google auth failed" });
  }
};


export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    //  Get user info
    const user = await User.findById(userId).select("-password");

    //  Get user's own books
    const myBooks = await Book.find({ ownerId: userId }).sort({ createdAt: -1 });

    //  Requests received as seller
    const receivedRequests = await Request.find({ sellerId: userId })
      .populate("bookId", "title author price condition status")
      .populate("buyerId", "name email phone")
      .sort({ createdAt: -1 });

    //  Requests sent as buyer
    const sentRequests = await Request.find({ buyerId: userId })
      .populate("bookId", "title author price condition status")
      .populate("sellerId", "name email phone")
      .sort({ createdAt: -1 });

    // Return everything in one response
    res.json({
      user,
      myBooks,
      receivedRequests,
      sentRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePhone = async (req, res) => {
  try {
    const { phone } = req.body;

    // 1. Validate input
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Simple validation (10 digit Indian number)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // 2. Check if phone already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Phone already in use" });
    }

    // 3. Update phone
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { phone },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Phone number updated successfully",
      user,
    });

  } catch (error) {
    console.error("Update phone error:", error);
    res.status(500).json({ message: "Server error" });
  }
};