const Task = require("../models/Task");

// Create task
exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const task = new Task({
            title,
            description,
            user: req.user.id, // from authMiddleware
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to create task" });
    }
};

// Get all tasks (only for logged-in user)
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
};

// Update task
exports.updateTask = async (req, res) => {
    try {
        const { title, description, completed } = req.body;

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title, description, completed },
            { new: true }
        );

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to update task" });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task" });
    }
};
