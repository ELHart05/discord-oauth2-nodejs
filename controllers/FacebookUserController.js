const FacebookUser = require("../models/FacebookUser");
const AppError = require("../utils/AppError");

const facebookAuthMe = (currentUser) => {
  return async (req, res, next) => {
  try {
    if (!currentUser) { 
      throw new AppError("auth_account_error", 400);
    }

    const fbUser = await  FacebookUser.findOne({ facebookID: currentUser.facebookID });

    if (!fbUser) {
      throw new AppError("user_not_found", 404);
    }

    if (!fbUser.likedEM) {
      throw new AppError("not_liked_em", 400);
    }

    if (fbUser.tookReward) {
      throw new AppError("already_took_reward", 400);
    }
    
    currentUser = "set-to-patch"

    res.status(200).send({id: fbUser.facebookID})

  } catch (err) {
    next(err);
  }
}}

const facebookAuthUpdateMe = (currentUser) => {
return async (req, res, next) => {
  try {

    if (currentUser !== "set-to-patch") { 
      throw new AppError("auth_account_error", 400);
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
}}

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