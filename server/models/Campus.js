const mongoose = require('mongoose');

const campusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

const Campus = mongoose.model('Campus', campusSchema);

module.exports = Campus;