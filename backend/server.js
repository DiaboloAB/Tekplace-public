const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config()
const mongoose = require('mongoose');
const User = require('./models/user');
const socketServer = require('./sockets/socket');

const passport = require('passport');
const passportAzureAd = require('passport-azure-ad');

const authConfig = require('./authConfig');
const router = require('./routes/index');
const { updatePixelCount } = require('./pixels/placePixel');

const app = express();

// app.set('trust proxy',  /* numberOfProxies */);

 const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// app.use(limiter)

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const bearerStrategy = new passportAzureAd.BearerStrategy({
    identityMetadata: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}/${authConfig.metadata.discovery}`,
    issuer: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}`,
    clientID: authConfig.credentials.clientID,
    audience: authConfig.credentials.clientID,
    validateIssuer: authConfig.settings.validateIssuer,
    passReqToCallback: authConfig.settings.passReqToCallback,
    loggingLevel: authConfig.settings.loggingLevel,
    loggingNoPII: authConfig.settings.loggingNoPII,
}, (req, token, done) => {

    if (!token.hasOwnProperty('scp') && !token.hasOwnProperty('roles')) {
        return done(new Error('Unauthorized'), null, "No delegated or app permission claims found");
    }

    return done(null, {}, token);
});

app.use(passport.initialize());

passport.use(bearerStrategy);

app.use('/api', (req, res, next) => {
    passport.authenticate('oauth-bearer', {
        session: false,
    }, (err, user, info) => {
        if (err) {
            return res.status(401).json({ error: err.message });
        }

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (info) {
            req.authInfo = info;
            return next();
        }
    })(req, res, next);
    },
    router,
    (err, req, res, next) => {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500).send(err);
    }
);

app.get('/api/user', async (req, res) => {
  const email = req.authInfo.preferred_username;
  const name = req.authInfo.name;
  const oid = req.authInfo.oid;

  try {
      let user = await User.findOne({ oid });

      if (!user) {
          user = new User({
            email,
            name,
            oid,
            nextPixelAt: Date.now() + 2.5 * 60 * 1000,
          });
          await user.save();
          console.log(`User created: ${email}`);
      }
      user = await updatePixelCount(user);
      user.timeLeftForPixel = new Date(user.nextPixelAt - Date.now()).getTime() / 1000;
      console.log(user);
      res.json(user);
  } catch (error) {
      console.error('Error retrieving/creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

const connectToMongo = async () => {
  try {
    console.log(process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

connectToMongo().then(() => {
  const PORT = process.env.PORT || 4000;
  console.log(`Starting socket server on port ${PORT}`);
  const server = socketServer(app);  // Initialize socket server with app
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

module.exports = app;
