const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");
const { verifyToken, verifyRole,  isAdmin } = require("../middlewares/auth");

// Get all users (Admin only)
router.get("/users", verifyToken, verifyRole("admin"), async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

// Get all tasks (Admin only)
router.get("/tasks", verifyToken, verifyRole("admin"), async (req, res) => {
    try {
        const tasks = await Task.find().populate("user", "email role");
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
});

// Delete any task by ID (Admin only)
router.delete("/tasks/:id", verifyToken, verifyRole("admin"), async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted by admin" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task" });
    }
});

router.post("/tasks", verifyToken, isAdmin, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = await Task.create({
      title,
      createdBy: req.user.id, 
    });

    const populatedTask = await newTask.populate("createdBy", "name email role");
    res.status(201).json(populatedTask);
  } catch (err) {
    console.error("Admin task creation error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
});

router.get("/tasks", verifyToken, isAdmin, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("createdBy", "name email role")   
      .populate("user", "name email");           

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});


module.exports = router;
