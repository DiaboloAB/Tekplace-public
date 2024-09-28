const mongoose = require('mongoose');

const position = {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
};

const pixelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    position: {
        type: position,
        required: true,
        unique: true,
    },
    color: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

const ActivePixel = mongoose.model('ActivePixel', pixelSchema);
const ArchivedPixel = mongoose.model('ArchivedPixel', pixelSchema);

module.exports = { ActivePixel, ArchivedPixel };
