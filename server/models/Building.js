const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    campus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campus',
        required: true
    },
    numberOfFloors: {
        type: Number,
        required: true
    },
    yearBuilt: {
        type: Number,
        required: true
    },
    facilities: [{
        type: String // e.g., "Library", "Laboratory", "Classroom"
    }]
}, { timestamps: true });

const Building = mongoose.model('Building', buildingSchema);

module.exports = Building;