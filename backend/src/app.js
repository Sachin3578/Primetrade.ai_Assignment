const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
    res.json({message: "API is running"});
});

module.exports = app;