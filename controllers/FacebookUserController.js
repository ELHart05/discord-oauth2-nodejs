const FacebookUser = require("../models/FacebookUser");
const AppError = require("../utils/AppError");

const facebookAuthMe = async (req, res, next) => {
  try {
    
    if (!req.isAuthenticated()) { 
      throw new AppError("Authenticate with your account to verify...", 400);
    }

    const fbUser = await FacebookUser.findOne({ facebookID: req.user.facebookID });

    if (!fbUser) {
      throw new AppError("User not found", 404);
    }

    if (!fbUser.likedEM) {
      throw new AppError("User didn't like EarthMeta page...", 400);
    }

    if (fbUser.tookReward) {
      throw new AppError("Already took reward...", 400);
    }

    res.status(200).send({id: fbUser.facebookID})

  } catch (err) {
    next(err);
  }
}

const facebookAuthUpdateMe = async (req, res, next) => {
  try {

    if (!req.isAuthenticated()) { 
      throw new AppError("Authenticate with your account to verify...", 400);
    }
    
    await FacebookUser.findOneAndUpdate({ facebookID: req.user.facebookID }, {
      tookReward: true
    });

    res.status(204).end();

  } catch (err) {
    next(err)
  }
}

//test purpose only
// const facebookAuthAll = async (req, res, next) => {
//   try {
      
//       const allAuths = await FacebookUser.find({});

//       res.status(200).send(allAuths)

//   } catch (err) {
//       next(err);
//   }
// }

module.exports = {
  facebookAuthMe,
  // facebookAuthAll,
  facebookAuthUpdateMe
}