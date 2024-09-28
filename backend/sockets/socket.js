const http = require('http');
const { Server } = require('socket.io');
const passport = require('passport');
const { updatePixelCount, placePixel } = require('../pixels/placePixel');

const User = require('../models/user');
const { mapSize, BATCH_SIZE, BATCH_INTERVAL } = require('../tekplaceConfig');

let pixelBatch = [];

module.exports = function (app) {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.headers['authorization'];

    if (!token || !token.startsWith('Bearer ')) {
      return next(new Error('Authentication error: No token provided'));
    }

    const accessToken = token.split(' ')[1];

    const req = {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    };

    passport.authenticate('oauth-bearer', { session: false }, (err, user, info) => {
      if (err) {
        console.error('Passport error:', err);
        return next(new Error('Authentication failed'));
      }

      if (!user) {
        console.error('Authentication failed: No user');
        return next(new Error('Authentication failed: No user'));
      }

      socket.user = info;
      next();
    })(req, {}, next);
  });

  setInterval(() => {
    if (pixelBatch.length > 0) {
      io.emit('updatePixelsBatch', pixelBatch);
      pixelBatch = [];
    }
  }, BATCH_INTERVAL);

  io.on('connection', (socket) => {

    socket.on('placePixel', async (data) => {
      console.log('placePixel', data);
      try {
        const oid = socket.user.oid;
        let user = await User.findOne({ oid });
        if (user.nbPixels <= 0) {
          return;
        }
        if (data.x < 0 || data.x >= mapSize || data.y < 0 || data.y >= mapSize) {
          return
        }
        user.nbPixels--;
        user.totalPixels++;
        user = await updatePixelCount(user);
        await user.save();
        await placePixel(data, user);

        const index = pixelBatch.findIndex((pixel) => pixel.position.x === data.x && pixel.position.y === data.y);
        if (index !== -1) {
          pixelBatch[index] = {
            position: { x: data.x, y: data.y },
            color: data.color,
            name: user.name,
            email: user.email,
          };
        } else {
          pixelBatch.push({
            position: { x: data.x, y: data.y },
            color: data.color,
            name: user.name,
            email: user.email,
          });
        }
        if (pixelBatch.length >= BATCH_SIZE) {
          io.emit('updatePixelsBatch', pixelBatch);
          pixelBatch = [];
        }
        socket.emit('updatePixel', {
          nbPixels: user.nbPixels,
          timeLeftForPixel: user.timeLeftForPixel,
        });
      } catch (error) {
        console.error('Error placing pixel:', error);
      }
    });

    socket.on('getPixel', async (data) => {
      console.log('getPixel', data);
      try {
        const oid = socket.user.oid;
        let user = await User.findOne({ oid });
        user = await updatePixelCount(user);
        socket.emit('updatePixel', {
          nbPixels: user.nbPixels,
          timeLeftForPixel: user.timeLeftForPixel,
        });
      } catch (error) {
        console.error('Error getting pixel:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return server;
};
