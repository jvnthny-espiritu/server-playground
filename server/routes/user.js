const router = require('express').Router();
const User = require('../models/User');
const passport = require('../config/passport-config');
const jwt = require('jsonwebtoken');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { username, fullname, password, role, campus } = req.body;
        const user = new User({ username, fullname, password, role, campus });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login Route
router.post('/login', passport.authenticate('local'), (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ message: 'Logged in successfully', token });
});

// Logout Route
router.post('/logout', (req, res) => {
    req.logout();
    res.status(200).send({ message: 'Logged out successfully' });
});

// Get All Users (Admin only)
router.get('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get User by ID
router.get('/:id', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('username fullname _id'); // Select only username, fullname, and _id fields
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update User
router.put('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('username fullname _id'); // Select only username, fullname, and _id fields
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete User
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;