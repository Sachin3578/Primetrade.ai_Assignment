const express = require("express");
const { register, login } = require("../controllers/authController");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

//Register route
router.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        return res.status(400).json({ message: "All fields are required" });
    }

    if(password.length < 6){
        return res.status(400).json({message: "Password must be at least 6 characters"});
    }

    //if validation passes, call controller
    register(req, res);
});

//admin register route
router.post("/admin-register", (req, res) => {
    const { name, email, password, role } = req.body;
    if(!name || !email || !password || !role){
        return res.status(400).json({ message: "All fields are required" });
    }
    if(password.length < 6){
        return res.status(400).json({message: "Password must be at least 6 characters"});
    }

    register(req, res);

})
//login route
// router.post("/login", (req,res) => {
//     const { email, password } = req.body;

//     if(!email || !password){
//         return res.status(400).json({
//             message: "email and password are required"
//         })
//     }

//     //if validation pases, call login controller
//     login(req, res);
// });

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, 
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;