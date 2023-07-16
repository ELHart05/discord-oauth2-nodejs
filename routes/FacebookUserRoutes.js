const { Router } = require("express");
const axios = require("axios");
const session = require('express-session');
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config();

let likedEM = false;

const router = Router();

//passport js implement
router.use(
  session({
      resave: false,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
  })
);

router.use(passport.initialize());
router.use(passport.session());
router.use(passport.authenticate('session'));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CLIENT_REDIRECT
},
async function(accessToken, refreshToken, profile, cb) {
  const res = await axios.get(`http://graph.facebook.com/v17.0/${profile.id}/likes?access_token=${accessToken}`);

  likedEM = res.data.data.some((like, index) => (
    like.id === "109776478271345"
  ))

  console.log(likedEM);
}
));

router.get('/login', passport.authenticate('facebook'));

router.get('/callback', passport.authenticate('facebook', { successReturnToOrRedirect: '/success', failureRedirect: '/failed' }),
function(req, res) {
  // Successful authentication, redirect home.
  console.log("done");
  // res.redirect('https://google.com');
});

module.exports = router;