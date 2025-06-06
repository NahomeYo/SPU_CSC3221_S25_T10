const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
 
const app = express();
const port = 3000;
 
// MongoDB connection 
mongoose.connect('mongodb+srv://Team10:1234@cluster0.pdc2xzl.mongodb.net/TM-T10?retryWrites=true&w=majority',)
// This will be error handling for the connection/mongoose
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));
 
// Middleware
/*
    I am enabling the CORS for all routes to allow cross-origin requests
    This will parse incoming JSON requests
    This static is to connect to public folder and helping it run HTML,CSS and client JS files
*/
app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 
 
// Mongoose model
const Task = require('./models/task');
 
 
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find()
            .sort({ createdAt: -1 })
            .select("-__v -createdAt -updatedAt")
            .lean();
        res.json(tasks); // return raw array
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});app.get("/tasks/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid task ID format" });
        }

        const task = await Task.findById(req.params.id)
            .select("-__v -createdAt -updatedAt")
            .lean();

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(task); // return raw task object
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});app.post("/tasks", async (req, res) => {
    try {
        let taskData = typeof req.body === "string" ? { title: req.body } : req.body;

        if (!taskData.title || taskData.title.trim() === "") {
            return res.status(400).json({ error: "Task title is required" });
        }

        const task = new Task(taskData);
        const savedTask = await task.save();
        const cleanTask = savedTask.toObject();
      

        res.status(201).json(cleanTask); // return raw task
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});app.put("/tasks/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid task ID format" });
        }

        const updates = req.body;

        if (req.query.completed !== undefined) {
            updates.completed = req.query.completed === "true";
        }

        const task = await Task.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        })
            .select("-__v -createdAt -updatedAt")
            .lean();

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(task); // return raw updated task
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});app.delete("/tasks/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid task ID format" });
        }

        const task = await Task.findByIdAndDelete(req.params.id)
            .select("-__v -createdAt -updatedAt")
            .lean();

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(task); // return raw deleted task
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
 
// This will start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});