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

let currentUser = ""; //local user to have the last user authed

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

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CLIENT_REDIRECT
}, async (accessToken, refreshToken, profile, done) => {
  // const res = await axios.get(`https://api.twitter.com/1.1/followers/list.json`, {headers: {
  //   'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
  // }});

  const exists = await TwitterUser.findOne({ twitterID: profile.id });

  if (exists) {
    currentUser = await TwitterUser.findOneAndUpdate({ twitterID: profile.id }, {
      twitterID: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      // likedEM
    })
  } else {
    currentUser = new TwitterUser({
      twitterID: profile.id,
      displayName: profile.displayName,
      username: profile.username,
      // likedEM
    })
    await currentUser.save();
  }
  return done(null, currentUser);
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

router.get('/me', async (req, res, next) => {
  try {
    
    if (!currentUser) { 
      throw new AppError("auth_account_error", 400);
    }

    const twitterUser = await TwitterUser.findOne({ twitterID: req.user.twitterID });

    if (!twitterUser) {
      throw new AppError("user_not_found", 404);
    }

    if (!twitterUser.likedEM) {
      throw new AppError("not_liked_em", 400);
    }

    if (twitterUser.tookReward) {
      throw new AppError("already_took_reward", 400);
    }

    currentUser = "set-to-patch"

    res.status(200).send({ id: twitterUser.twitterID });

  } catch (err) {
    next(err);
  }
});

router.patch('/me', async (req, res, next) => {
  try {

    if (currentUser !== "set-to-patch") { 
      throw new AppError("auth_account_error", 400);
    }
    
    await TwitterUser.findOneAndUpdate({ twitterID: req.user.twitterID }, {
      tookReward: true
    });

    res.status(204).end();

  } catch (err) {
    next(err);
  } finally {
    currentUser = "";
  }
});

// router.get('/', twitterAuthAll);

module.exports = router;