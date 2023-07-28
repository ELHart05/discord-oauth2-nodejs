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
        required: true,
        unique: true
    },
    tookReward: {
        type: Boolean,
        default: false
    },
    joinedEM: {
        type: Boolean,
        default: true
    }
})

const TelegramUser = mongoose.model('TelegramUsers', TelegramUserSchema);

module.exports = TelegramUser;