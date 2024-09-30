const router = require('express').Router();
const Campus = require('../models/Campus');

// Create a new campus
router.post('/', async (req, res) => {
    try {
        const campus = new Campus(req.body);
        await campus.save();
        res.status(201).json(campus);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all campuses
router.get('/', async (req, res) => {
    try {
        const campuses = await Campus.find({}, 'name _id'); // Select only name and _id fields
        const campusDict = {};
        campuses.forEach(campus => {
            campusDict[campus._id] = campus.name;
        });
        res.json(campusDict);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a campus by ID
router.get('/:id', async (req, res) => {
    try {
        const campus = await Campus.findById(req.params.id).select('name _id');;
        if (!campus) {
            return res.status(404).json({ error: 'Campus not found' });
        }
        res.json(campus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a campus by ID
router.put('/:id', async (req, res) => {
    try {
        const campus = await Campus.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!campus) {
            return res.status(404).json({ error: 'Campus not found' });
        }
        res.json(campus);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a campus by ID
router.delete('/:id', async (req, res) => {
    try {
        const campus = await Campus.findByIdAndDelete(req.params.id);
        if (!campus) {
            return res.status(404).json({ error: 'Campus not found' });
        }
        res.json({ message: 'Campus deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;