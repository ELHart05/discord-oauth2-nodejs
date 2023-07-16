const TelegramUser = require("../models/TelegramUser");

const getTelegramUsers = async (req, res, next) => {
    try {
        const { username } = req.query;

        let result;

        if (username === undefined) {
            result = await TelegramUser.find({});
        } else {
            result = await TelegramUser.findOne({username}); //example: http://localhost:4000/auth/telegram?username=${username}
        }

        res.status(200).send(result);
        
    } catch (err) {
        next(err);
    }
}

module.exports = { getTelegramUsers };