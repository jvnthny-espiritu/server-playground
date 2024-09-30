const router = require('express').Router();
const Asset = require('../models/Asset');

// Create a new asset
router.post('/', async (req, res) => {
    try {
        const asset = new Asset(req.body);
        await asset.save();
        res.status(201).json(asset);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all assets with optional filtering
router.get('/', async (req, res) => {
    try {
        const { room, category, status, condition } = req.query;

        if (!room) {
            return res.status(400).json({ error: 'Room parameter is required' });
        }

        const filter = { location: room };

        if (category) {
            filter.category = category;
        }

        if (status) {
            filter.status = status;
        }

        if (condition) {
            filter.condition = condition;
        }

        const assets = await Asset.find(filter).populate('location', 'name');
        res.status(200).json(assets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single asset by ID
router.get('/:id', async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id).populate('location', 'name');
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }
        res.status(200).json(asset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an asset by ID
router.put('/:id', async (req, res) => {
    try {
        const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }
        res.status(200).json(asset);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete an asset by ID
router.delete('/:id', async (req, res) => {
    try {
        const asset = await Asset.findByIdAndDelete(req.params.id);
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }
        res.status(200).json({ message: 'Asset deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;