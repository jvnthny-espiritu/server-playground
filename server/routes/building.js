const router = require('express').Router();
const Building = require('../models/Building');

// Create a new building
router.post('/', async (req, res) => {
    try {
        const building = new Building(req.body);
        await building.save();
        res.status(201).json(building);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all buildings with optional filtering
router.get('/', async (req, res) => {
    try {
        const { campus, facility } = req.query;
        const filter = {};

        if (campus) {
            filter.campus = campus;
        }
        if (facility) {
            filter.facility = facility;
        }

        const buildings = await Building.find(filter);
        res.status(200).json(buildings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single building by ID
router.get('/:id', async (req, res) => {
    try {
        const building = await Building.findById(req.params.id);
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.status(200).json(building);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a building by ID
router.put('/:id', async (req, res) => {
    try {
        const building = await Building.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.status(200).json(building);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a building by ID
router.delete('/:id', async (req, res) => {
    try {
        const building = await Building.findByIdAndDelete(req.params.id);
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.status(200).json({ message: 'Building deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;