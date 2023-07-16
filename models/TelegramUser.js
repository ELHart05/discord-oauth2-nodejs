const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TelegramUserSchema = new Schema({
    telegramID: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true,
        unique: true
    }
})

const TelegramUser = mongoose.model('TelegramUsers', TelegramUserSchema);

module.exports = TelegramUser;