const TelegramUser = require("../models/TelegramUser");
const AppError = require("../utils/AppError")

const getTelegramUser = async (req, res, next) => {
    try {
        const { username } = req.query;

        if (username === undefined) {
            throw new AppError("Oh!, User can't be retrieved...", 404);
        }

        let result = await TelegramUser.findOne({username}); //example: http://localhost:4000/auth/telegram?username=${username}
        
        if (!result) {
            throw new AppError("Oh!, User not found...", 404);
        }

        if (!result.joinedEM) {
            throw new AppError("User didn't join EarthMeta group...", 400);
        }
    
        if (result.tookReward) {
            throw new AppError("Already took reward...", 400);
        }

        res.status(200).send({telegramID: result.telegramID});

    } catch (err) {
        next(err);
    }
}

const activateUserUsed = async (req, res, next) => {
    try {
        const { username } = req.query;

        if (username === undefined) {
            throw new AppError("Oh!, User can't be retrieved...");
        } else {
            let result = await TelegramUser.findOneAndUpdate({username}, {
                tookReward: true
            }); //example: http://localhost:4000/auth/telegram?username=${username}

            if (!result) {
                throw new AppError("Oh!, User not found...", 404);
            }

            res.status(204).end();
        }
        
    } catch (err) {
        next(err);
    }
}

module.exports = { getTelegramUser, activateUserUsed };