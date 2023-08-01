const { Router } = require("express");
const axios = require("axios");
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const passport = require("passport");
const TwitterUser = require("../models/TwitterUser");
const TwitterStrategy = require("passport-twitter").Strategy;
const {
  twitterAuthMe,
  // twitterAuthAll,
  twitterAuthUpdateMe
} = require("../controllers/TwitterUserController")
require("dotenv").config();

const router = Router();

//passport js implement
router.use(session({ 
  secret: process.env.PASSPORT_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  // store: new MemoryStore({
  //   checkPeriod: 86400000 // prune expired entries every 24h
  // }),
  cookie: { maxAge: 5 * 60 * 1000 } 
})); //the user has only 5 minuites to verify before the session ends

router.use(passport.initialize());
router.use(passport.session());

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CLIENT_REDIRECT
}, async (accessToken, refreshToken, profile, done) => {
  // const res = await axios.get(`https://api.twitter.com/1.1/followers/list.json`, {headers: {
  //   'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
  // }});

  let newUser;

  const exists = await TwitterUser.findOne({ twitterID: profile.id });

  if (exists) {
    newUser = await TwitterUser.findOneAndUpdate({ twitterID: profile.id }, {
      twitterID: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      // likedEM
    })
  } else {
    newUser = new TwitterUser({
      twitterID: profile.id,
      displayName: profile.displayName,
      username: profile.username,
      // likedEM
    })
    await newUser.save();
  }
  return done(null, {...newUser._doc});
}));


passport.serializeUser((user, done) => {
  // Serialize user object
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // Deserialize user object
  done(null, user);
});

router.get('/login', passport.authenticate('twitter'));

router.get('/callback', passport.authenticate('twitter', {
  successRedirect: process.env.Twitter_FINAL_REDIRECT,
  failureRedirect: process.env.Twitter_FINAL_REDIRECT
}));

router.get('/me', twitterAuthMe);

router.patch('/me', twitterAuthUpdateMe);

// router.get('/', twitterAuthAll);

module.exports = router;