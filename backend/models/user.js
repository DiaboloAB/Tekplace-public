const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    oid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    nbPixels: { type: Number, default: 0 },
    totalPixels: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    nextPixelAt: { type: Date, default: Date.now },
    timeLeftForPixel: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
