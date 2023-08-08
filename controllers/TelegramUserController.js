const TelegramUser = require("../models/TelegramUser");
const AppError = require("../utils/AppError")

const getTelegramUser = async (req, res, next) => {
    try {
        const { username } = req.query;

        console.log(typeof username);

        if (username === undefined || typeof username !== "string") {
            throw new AppError("user_not_found", 404);
        }

        let result = await TelegramUser.findOne({username}); //example: http://localhost:4000/auth/telegram?username=${username}
        
        if (!result) {
            throw new AppError("user_not_found", 404);
        }

        if (result.username === "undefined") {
            throw new AppError('Check your username please...', 400); //a lot of users don't define their username, which is essential
        }

        if (!result.joinedEM) {
            throw new AppError("not_join_em", 400);
        }
    
        if (result.tookReward) {
            throw new AppError("already_took_reward", 400);
        }

        res.status(200).send({telegramID: result.telegramID});

    } catch (err) {
        next(err);
    }
}

const activateUserUsed = async (req, res, next) => {
    try {
        const { username } = req.query;

        if (username === undefined || typeof username !== "string") {
            throw new AppError("user_not_found");
        } else {
            let result = await TelegramUser.findOneAndUpdate({username}, {
                tookReward: true
            }); //example: http://localhost:4000/auth/telegram?username=${username}

            if (!result) {
                throw new AppError("user_not_found", 404);
            }

            res.status(204).end();
        }
        
    } catch (err) {
        next(err);
    }
}

module.exports = { getTelegramUser, activateUserUsed };