const TwitterUser = require("../models/TwitterUser");
const AppError = require("../utils/AppError");

const twitterAuthMe = (currentUser) => {
return async (req, res, next) => {
  try {
    
    if (!currentUser) { 
      throw new AppError("Authenticate with your account to verify...", 400);
    }

    const twitterUser = await TwitterUser.findOne({ twitterID: req.user.twitterID });

    if (!twitterUser) {
      throw new AppError("User not found", 404);
    }

    if (!twitterUser.likedEM) {
      throw new AppError("User didn't like EarthMeta page...", 400);
    }

    if (twitterUser.tookReward) {
      throw new AppError("Already took reward...", 400);
    }

    currentUser = "set-to-patch"

    res.status(200).send({ id: twitterUser.twitterID });

  } catch (err) {
    next(err);
  }
}}

const twitterAuthUpdateMe = (currentUser) => { 
return async (req, res, next) => {
  try {

    if (currentUser !== "set-to-patch") { 
      throw new AppError("Authenticate with your account to verify...", 400);
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
}}

//test purpose only
// const twitterAuthAll = async (req, res, next) => {
//   try {
      
//       const allAuths = await TwitterUser.find({});

//       res.status(200).send(allAuths)

//   } catch (err) {
//       next(err);
//   }
// }

module.exports = {
  twitterAuthMe,
  twitterAuthUpdateMe,
  // twitterAuthAll
}