const { Router } = require("express");
const axios = require("axios");
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const passport = require("passport");
const FacebookUser = require("../models/FacebookUser");
const FacebookStrategy = require("passport-facebook").Strategy;
const {
  facebookAuthMe,
  facebookAuthUpdateMe,
  // facebookAuthAll
} = require("../controllers/FacebookUserController");
const AppError = require("../utils/AppError");
require("dotenv").config();

const router = Router();

let currentUser = ""; //local user to have the last user authed

//passport js implement
router.use(session({ 
  secret: process.env.PASSPORT_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: { 
    maxAge: 5 * 60 * 1000
  }
})); //the user has only 5 minuites to verify before the session ends

router.use(passport.initialize());
router.use(passport.session());

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CLIENT_REDIRECT
}, async (accessToken, refreshToken, profile, done) => {

  const res = await axios.get(`http://graph.facebook.com/v17.0/${profile.id}/likes?access_token=${accessToken}`);
  let likedEM = res.data.data.some((page) => (
    page.id === "109776478271345" //this is EM facebook page id which is unique
  ))

  const exists = await FacebookUser.findOne({ facebookID: profile.id });

  if (exists) {
    currentUser = await FacebookUser.findOneAndUpdate({ facebookID: profile.id }, {
      facebookID: profile.id,
      displayName: profile.displayName,
      likedEM
    })
  } else {
    currentUser = new FacebookUser({
      facebookID: profile.id,
      displayName: profile.displayName,
      likedEM
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

router.get('/login', passport.authenticate('facebook'));

router.get('/callback', passport.authenticate('facebook', {
  successRedirect: process.env.FACEBOOK_FINAL_REDIRECT,
  failureRedirect: process.env.FACEBOOK_FINAL_REDIRECT
}));

router.get('/me', async (req, res, next) => {
  try {
    if (!currentUser) { 
      throw new AppError("Authenticate with your account to verify...", 400);
    }

    const fbUser = await  FacebookUser.findOne({ facebookID: currentUser.facebookID });

    if (!fbUser) {
      throw new AppError("User not found", 404);
    }

    if (!fbUser.likedEM) {
      throw new AppError("User didn't like EarthMeta page...", 400);
    }

    if (fbUser.tookReward) {
      throw new AppError("Already took reward...", 400);
    }
    
    currentUser = "set-to-patch";

    res.status(200).send({id: fbUser.facebookID})

  } catch (err) {
    next(err);
  }
});

router.patch('/me', async (req, res, next) => {
  try {

    if (currentUser !== "set-to-patch") { 
      throw new AppError("Authenticate with your account to verify...", 400);
    }
    
    await FacebookUser.findOneAndUpdate({ facebookID: currentUser.facebookID }, {
      tookReward: true
    });

    res.status(204).end();

  } catch (err) {
    next(err)
  } finally {
    currentUser = "";
  }
});

// router.get('/', facebookAuthAll);

module.exports = router;