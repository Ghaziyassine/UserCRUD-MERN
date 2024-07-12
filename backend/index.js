const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const User = require('./models/userModel.js');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Set up multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({
    storage: storage
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find(req.body);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user by id
app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add user with image
app.post('/api/users', upload.single('file'), async (req, res) => {
    try {
        const user = new User({
            ...req.body,
            image: req.file ? req.file.filename : null
        });
        const savedUser = await user.save();
        res.status(200).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user with image
app.put('/api/users/:id', upload.single('file'), async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.filename;
        }
        await User.findByIdAndUpdate(id, updateData);

        const updatedUser = await User.findById(id);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Connection to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017")
    .then(() => {
        console.log("You are connected to the database");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    }).catch(() => {
        console.log("Connection failed");
    });
