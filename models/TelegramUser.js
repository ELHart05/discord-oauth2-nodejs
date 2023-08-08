const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TelegramUserSchema = new Schema({
    telegramID: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String
    },
    username: {
        type: String,
        required: false,
        dafault: "undefined" //there's some users without username, if no username then undefined
    },
    tookReward: {
        type: Boolean,
        default: false
    },
    joinedEM: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const TelegramUser = mongoose.model('TelegramUsers', TelegramUserSchema);

module.exports = TelegramUser;