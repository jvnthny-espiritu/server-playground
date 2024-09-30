const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    floor: {
        type: Number,
        required: true
    },
    purpose: {
        type: String, // e.g., "Library", "Laboratory", "Lecture Hall"
        required: true
    },
    status: String,
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;