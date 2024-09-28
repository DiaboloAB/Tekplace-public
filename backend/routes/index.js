const express = require('express');

const router = express.Router();
const {colors, mapSize} = require('../tekplaceConfig');

const User = require('../models/user');
const { ActivePixel, ArchivedPixel } = require('../models/pixel');

router.get('/protected', (req, res) => {
    console.log('This is a protected route');
    res.json({ message: 'This is a protected route' });
});

router.get('/map', async (req, res) => {
    console.log('Getting map');
    try {
        const pixels = await ActivePixel.find({});
        res.json({
            pixels,
            colors: colors,
            mapSize: mapSize,
        });
    } catch (error) {
        console.error('Error getting map:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/placepixel', async (req, res) => {
    console.log('Placing pixel');
    if (req.authInfo.preferred_username !== process.env.ADMIN_EMAIL)
        return res.status(403).json({ error: 'Forbidden' });
    try {
        if (!req.body.position || !req.body.color) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        const pixel = new ActivePixel({
            position: {
                x: req.body.position.x,
                y: req.body.position.y,
            },
            color: req.body.color,
            email: req.authInfo.preferred_username,
            name: req.authInfo.name,
        });

        await pixel.save();
        res.json({ message: 'Pixel placed' });
    } catch (error) {
        console.error('Error placing pixel:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/ranking', async (req, res) => {
    console.log('Getting ranking');
    try {
        const users = await User.find({}).sort({ pixelsPlaced: -1 });
        let totalPixels = 0;
        users.forEach((user) => {
            totalPixels += user.totalPixels;
        });
        res.json({
            users,
            totalPixels,
        });
    } catch (error) {
        console.error('Error getting ranking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
