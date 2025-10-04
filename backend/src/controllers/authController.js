const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Register User
exports.register = async (req, res) => {
    try {
        const{ name, email, password, role } =req.body;

        //check existing user
        let user = await User.findOne({ email });
        if(user) return res.status(400).json({ message: "User already exists" });

        //Hash Password
        let salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "failed to register" });
    }
};

//Login User
exports.login = async (req,res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "failed to login" });
    }
};