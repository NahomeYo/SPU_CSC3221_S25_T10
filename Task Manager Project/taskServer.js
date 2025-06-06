const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
 
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
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
 
// Mongoose model
const Task = require('./models/task');
 
// Routes
<<<<<<< HEAD
 
=======

>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
// GET all tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 }); // Sort by newest first
        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        console.error("Error fetching tasks:", err);
<<<<<<< HEAD
        res.status(500).json({
            success: false,
            error: "Failed to fetch tasks",
            message: err.message
        });
    }
});
 
=======
        res.status(500).json({ 
            success: false,
            error: "Failed to fetch tasks",
            message: err.message 
        });
    }
});

>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
// GET specific task by ID
app.get("/tasks/:id", async (req, res) => {
    try {
        // Validate the ID format first
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
<<<<<<< HEAD
            return res.status(400).json({
=======
            return res.status(400).json({ 
>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
                success: false,
                error: "Invalid task ID format",
                message: "Task ID must be a valid MongoDB ObjectId (24 character hex string)"
            });
        }
 
        const task = await Task.findById(req.params.id);
        if (!task) {
<<<<<<< HEAD
            return res.status(404).json({
=======
            return res.status(404).json({ 
>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
                success: false,
                error: "Task not found",
                message: `No task found with ID: ${req.params.id}`
            });
        }
        
        res.json({
            success: true,
            data: task
        });
    } catch (err) {
        console.error("Error fetching task:", err);
<<<<<<< HEAD
        res.status(500).json({
            success: false,
            error: "Failed to fetch task",
            message: err.message
=======
        res.status(500).json({ 
            success: false,
            error: "Failed to fetch task",
            message: err.message 
>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
        });
    }
});
 
// POST - Create new task
app.post('/tasks', async (req, res) => {
    try {
        // Handle both JSON objects and simple strings
        let taskData;
        if (typeof req.body === 'string') {
            taskData = { title: req.body };
        } else {
            taskData = req.body;
        }
<<<<<<< HEAD
 
=======

>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
        // Validate required fields
        if (!taskData.title || taskData.title.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                message: 'Task title is required'
            });
        }
<<<<<<< HEAD
 
=======

>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
        const task = new Task(taskData);
        const savedTask = await task.save();
        
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: savedTask
        });
    } catch (error) {
        console.error("Error creating task:", error);
<<<<<<< HEAD
        res.status(400).json({
            success: false,
            error: 'Failed to create task',
            message: error.message
=======
        res.status(400).json({ 
            success: false,
            error: 'Failed to create task',
            message: error.message 
>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
        });
    }
});
 
// PUT - Update task by ID
app.put('/tasks/:id', async (req, res) => {
    try {
        // Validate the ID format first
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
<<<<<<< HEAD
            return res.status(400).json({
=======
            return res.status(400).json({ 
>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
                success: false,
                error: "Invalid task ID format",
                message: "Task ID must be a valid MongoDB ObjectId"
            });
        }
<<<<<<< HEAD
 
=======

>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
        const updates = req.body;
 
        // Allow ?completed=true as a query override
        if (req.query.completed !== undefined) {
            updates.completed = req.query.completed === "true";
        }
<<<<<<< HEAD
 
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            updates,
=======

        const task = await Task.findByIdAndUpdate(
            req.params.id, 
            updates, 
>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
            { new: true, runValidators: true }
        );
        
        if (!task) {
<<<<<<< HEAD
            return res.status(404).json({
=======
            return res.status(404).json({ 
>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
                success: false,
                error: "Task not found",
                message: `No task found with ID: ${req.params.id}`
            });
        }
        
        res.json({
            success: true,
            message: 'Task updated successfully',
            data: task
        });
    } catch (error) {
        console.error("Error updating task:", error);
<<<<<<< HEAD
        res.status(400).json({
            success: false,
            error: 'Failed to update task',
            message: error.message
=======
        res.status(400).json({ 
            success: false,
            error: 'Failed to update task',
            message: error.message 
>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
        });
    }
});
 
// DELETE - Delete task by ID
app.delete('/tasks/:id', async (req, res) => {
    try {
        // Validate the ID format first
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
<<<<<<< HEAD
            return res.status(400).json({
=======
            return res.status(400).json({ 
>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
                success: false,
                error: "Invalid task ID format",
                message: "Task ID must be a valid MongoDB ObjectId"
            });
        }
<<<<<<< HEAD
 
        const task = await Task.findByIdAndDelete(req.params.id);
        
        if (!task) {
            return res.status(404).json({
=======

        const task = await Task.findByIdAndDelete(req.params.id);
        
        if (!task) {
            return res.status(404).json({ 
>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
                success: false,
                error: "Task not found",
                message: `No task found with ID: ${req.params.id}`
            });
        }
        
<<<<<<< HEAD
        res.json({
=======
        res.json({ 
>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
            success: true,
            message: "Task deleted successfully",
            data: task
        });
    } catch (error) {
        console.error("Error deleting task:", error);
<<<<<<< HEAD
        res.status(500).json({
            success: false,
            error: 'Failed to delete task',
            message: error.message
=======
        res.status(500).json({ 
            success: false,
            error: 'Failed to delete task',
            message: error.message 
>>>>>>> 0202dce37193ab38a236ba377d87f3e4a7b7d170
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});
 
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});
 
// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
});