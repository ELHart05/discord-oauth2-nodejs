const { Router } = require("express");
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const passport = require("passport");
const InstagramUser = require("../models/InstagramUser");
const InstagramStrategy = require("passport-instagram").Strategy;
const {
  instagramAuthMe,
  // instagramAuthAll,
} = require("../controllers/InstagramUserController")
require("dotenv").config();

const router = Router();

//passport js implement
router.use(session({ 
  secret: process.env.PASSPORT_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: { maxAge: 5 * 60 * 1000 } 
})); //the user has only 5 minuites to verify before the session ends

router.use(passport.initialize());
router.use(passport.session());

passport.use(new InstagramStrategy({
  clientID: process.env.INSTAGRAM_CLIENT_ID,
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  callbackURL: process.env.INSTAGRAM_CLIENT_REDIRECT,
}, async (accessToken, refreshToken, profile, done) => {
  let newUser;

  const exists = await InstagramUser.findOne({ instagramID: profile.id });

  if (exists) {
    newUser = await InstagramUser.findOneAndUpdate({ instagramID: profile.id }, {
      instagramID: profile.id,
      username: profile.username,
      displayName: profile.displayName,
    })
  } else {
    newUser = new InstagramUser({
      instagramID: profile.id,
      displayName: profile.displayName,
      username: profile.username,
    })
    await newUser.save();
  }
  return done(null, {...profile});
}));


passport.serializeUser((user, done) => {
  // Serialize user object
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // Deserialize user object
  done(null, user);
});

router.get('/login', passport.authenticate('instagram', { scope: ["user_profile", "user_media"] }));

router.get('/callback', passport.authenticate('instagram', {
  successRedirect: process.env.INSTAGRAM_FINAL_REDIRECT,
  failureRedirect: process.env.INSTAGRAM_FINAL_REDIRECT
}));

router.get('/me', instagramAuthMe);

// router.get('/', twitterAuthAll);

module.exports = router;