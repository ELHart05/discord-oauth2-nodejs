const { Router } = require("express");
const axios = require("axios");
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const passport = require("passport");
const FacebookUser = require("../models/FacebookUser");
const FacebookStrategy = require("passport-facebook").Strategy;
const {
  facebookAuthMe,
  // facebookAuthAll,
  facebookAuthUpdateMe
} = require("../controllers/FacebookUserController")
require("dotenv").config();

const router = Router();

//passport js implement
router.use(session({ 
  secret: process.env.FACEBOOK_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: { maxAge: 5 * 60 * 1000 } 
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

  let newUser;

  const exists = await FacebookUser.findOne({ facebookID: profile.id });

  if (exists) {
    newUser = await FacebookUser.findOneAndUpdate({ facebookID: profile.id }, {
      facebookID: profile.id,
      displayName: profile.displayName,
      likedEM
    })
  } else {
    newUser = new FacebookUser({
      facebookID: profile.id,
      displayName: profile.displayName,
      likedEM
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

router.get('/login', passport.authenticate('facebook'));

router.get('/callback', passport.authenticate('facebook', {
  successRedirect: process.env.FACEBOOK_FINAL_REDIRECT,
  failureRedirect: process.env.FACEBOOK_FINAL_REDIRECT
}));

router.get('/me', facebookAuthMe);

router.patch('/me', facebookAuthUpdateMe);

// router.get('/', facebookAuthAll);

module.exports = router;