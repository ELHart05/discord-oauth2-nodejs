const { Router } = require("express");
const axios = require("axios");
const session = require('express-session');
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config();

let likedEM = false;

const router = Router();

//passport js implement
router.use(session({ secret: 'thisismysecretkey', resave: true, saveUninitialized: true }));

router.use(passport.initialize());
router.use(passport.session());

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CLIENT_REDIRECT
}, async (accessToken, refreshToken, profile, done) => {
  const res = await axios.get(`http://graph.facebook.com/v17.0/${profile.id}/likes?access_token=${accessToken}`);
  likedEM = res.data.data.some((like, index) => (
    like.id === "109776478271345"
  ))
  console.log(likedEM);
  return done(null, profile);
}));


passport.serializeUser((user, done) => {
  // Serialize user object
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // Deserialize user object
  done(null, user);
});

router.get('/', passport.authenticate('facebook'));

router.get('/callback', passport.authenticate('facebook', {
  successRedirect: '/auth/facebook/profile',
  failureRedirect: '/auth/facebook/login'
}));

router.get('/profile', (req, res) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.send(req.session.passport.user)
  } else {
    // User is not authenticated, redirect or display an error message
    // res.redirect('/login');
    res.send({
      session: "not authed"
    })
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;