const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); // Import cors
 
const app = express();
const port = 3000;
 
// MongoDB connection
mongoose.connect('mongodb+srv://Team10:1234@cluster0.pdc2xzl.mongodb.net/TM-T10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));
 
// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
 
// Mongoose model
const Task = require('./models/task');
 
// Routes
// In your server.js
app.get("/tasks/:id", async (req, res) => {
    try {
        // Validate the ID format first
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid task ID format" });
        }

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(task);
    } catch (err) {
        console.error("Error fetching task:", err);
        res.status(500).json({ error: "Failed to fetch task" });
    }
});
 
app.get("/tasks", async (req, res) => { // Added route to get all tasks
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});
 
app.post('/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create task' });
    }
});
 
// New PUT route to update a task by ID
app.put('/tasks/:id', async (req, res) => {
    try {
        const updates = req.body;

        // Allow ?completed=true as a query override
        if (req.query.completed !== undefined) {
            updates.completed = req.query.completed === "true";
        }

        const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update task' });
    }
});
 
// New DELETE route to delete a task by ID
app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});
 
// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});