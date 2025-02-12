const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  const {
    username,
    email,
    password,
    userType,
    contactNumber,
    skills,
    experience,
    place,
  } = req.body; // Destructure all fields from the request body

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user object with all provided fields
    const newUser = {
      username,
      email,
      password,
      userType,
      contactNumber,
    };

    // Add caregiver-specific details only if the userType is caregiver
    if (userType === "caregiver") {
      newUser.skills = skills;
      newUser.experience = experience;
      newUser.place = place;
    }

    // Create a new User instance
    user = new User(newUser);

    // Save user to the database
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with the token and user details
    res.status(201).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
