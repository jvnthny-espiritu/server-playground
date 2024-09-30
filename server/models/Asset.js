const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['electric', 'non-electric']
    },
    condition: {
        type: String,
        enum: ['new', 'good', 'fair', 'poor'],
        default: 'good'
    },
    status: {
        type: String,
        required: true,
        enum: ['good condition', 'not working', 'for replacement', 'under maintenance'],
        default: 'good condition'
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    purchaseDate: {
        type: Date,
    },
    value: {
        type: Number,
    },
    numberOfUnits: {
        type: Number,
        min: 1
    },
    electricDetails: {
        voltage: Number,
        power: Number,
        manufacturer: String,
        warranty: String,
    },
    nonElectricDetails: {
        material: String,
        dimensions: String,
        weight: Number, 
    }
}, { timestamps: true });

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;