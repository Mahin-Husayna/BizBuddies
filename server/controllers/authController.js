const User = require("../models/User");

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      role: role || "buyer", // default role
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};