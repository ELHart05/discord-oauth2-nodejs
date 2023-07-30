const InstagramUser = require("../models/InstagramUser");
const AppError = require("../utils/AppError");

const instagramAuthMe = async (req, res, next) => {
  try {
    
    if (!req.isAuthenticated()) { 
      throw new AppError("Authenticate with your account to verify...", 400);
    }

    const instagramUser = await InstagramUser.findOne({ instagramID: req.user.instagramID });

    if (!instagramUser) {
      throw new AppError("User not found", 404);
    }

    res.status(200).send({id: instagramUser.instagramID})

  } catch (err) {
    next(err);
  }
}

//test purpose only
// const instagramAuthAll = async (req, res, next) => {
//   try {
      
//       const allAuths = await InstagramUser.find({});

//       res.status(200).send(allAuths)

//   } catch (err) {
//       next(err);
//   }
// }

module.exports = {
  instagramAuthMe,
  // instagramAuthAll
}