const { ActivePixel, ArchivedPixel } = require('../models/pixel');
const { PIXEL_TIME } = require('../tekplaceConfig');
const { colors } = require('../tekplaceConfig');

async function updatePixelCount(user) {
    try {
        const now = Date.now();
        while (user.nextPixelAt <= now) {
            user.nbPixels++;
            user.nextPixelAt = new Date(user.nextPixelAt.getTime() + PIXEL_TIME);
        }
        if (user.nbPixels > 15)
            user.nbPixels = 15;
        user.timeLeftForPixel = new Date(user.nextPixelAt - now).getTime() / 1000;
        await user.save();
        return user;
    } catch (error) {
        console.error('Error updating pixel count:', error);
    }
    return user;
}

async function placePixel(data, user) {
    try {
        const pixel = await ActivePixel.findOne({ 'position.x': data.x, 'position.y': data.y });
        if (data.color > colors.length - 1) {
            data.color = 0;
        }
        if (pixel) {
            const archivedPixel = new ArchivedPixel(pixel.toObject());
            await archivedPixel.save();
            await ActivePixel.deleteOne({ _id: pixel._id });
        }
        const newPixel = new ActivePixel({
            position: { x: data.x, y: data.y },
            color: data.color,
            name: user.name,
            email: user.email,
        });
        await newPixel.save();
    } catch (error) {
        console.error('Error placing pixel:', error);
    }
};

module.exports = { placePixel, updatePixelCount };