const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();


app.use(express.json());


app.use(
  cors({
    origin: process.env.CLIENT_URL, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,              
  })
);

// PI Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/admin", adminRoutes);

// est Route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});


module.exports = app;
