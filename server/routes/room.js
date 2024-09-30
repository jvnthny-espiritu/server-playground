const router = require('express').Router();
const Room = require('../models/Room');
const updateBuildingFacilities = require('../utils/updateBuildingFacilities');

// Create a new room
router.post('/', async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        await updateBuildingFacilities(room.building);
        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all rooms with optional filtering
router.get('/', async (req, res) => {
    try {
        const { building, purpose } = req.query;

        if (!building) {
            return res.status(400).json({ error: 'Building parameter is required' });
        }

        const filter = { building };

        if (purpose) {
            filter.purpose = purpose;
        }

        const rooms = await Room.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$floor',
                    rooms: {
                        $push: {
                            name: '$name',
                            purpose: '$purpose',
                            status: '$status'
                        }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single room by ID
router.get('/:id', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate('building', 'name');
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a room by ID
router.put('/:id', async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('building', 'name');
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.status(200).json(room);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a room by ID
router.delete('/:id', async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;