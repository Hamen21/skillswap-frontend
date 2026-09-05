const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Create a new user
router.post('/register', async (req, res) => {
    try {
        const {
    name,
    email,
    password,
    phone,
    location,
    bio
} = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    location,
    bio
});

       res.status(201).json({
    message: 'User registered successfully',
    user: {
        id: user._id,
        name: user.name,
        email: user.email
    }
});

    } catch (error) {
        res.status(500).json({
            message: 'Registration failed',
            error: error.message
        });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();

        res.json(users);

    } catch (error) {
        res.status(500).json({
            message: 'Failed to get users',
            error: error.message
        });
    }
});
// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        const isPasswordCorrect =
            await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Login failed',
            error: error.message
        });
    }
});
// Update user education
router.put('/education/:id', async (req, res) => {
    try {
        const { college, degree, year, specialization } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                education: {
                    college,
                    degree,
                    year,
                    specialization
                }
            },
            {
                new: true
            }
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            message: 'Education updated successfully',
            user
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to update education',
            error: error.message
        });
    }
});
// Update user skills
router.put('/skills/:id', async (req, res) => {
    try {
        const { teachSkills, learnSkills } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                teachSkills,
                learnSkills
            },
            {
                new: true
            }
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            message: 'Skills updated successfully',
            user
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to update skills',
            error: error.message
        });
    }
});
// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({
            message: 'Failed to get user',
            error: error.message
        });
    }
});
// Update user profile
router.put('/profile/:id', async (req, res) => {
    try {
        const {
            name,
            bio,
            education,
            teachSkills,
            learnSkills
        } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                bio,
                education,
                teachSkills,
                learnSkills
            },
            {
                new: true
            }
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            message: 'Profile updated successfully',
            user
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to update profile',
            error: error.message
        });
    }
});
module.exports = router;