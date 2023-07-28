const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DiscordUserSchema = new Schema({
    discordID: {
        type: String,
        required: true,
        unique: true
    }, 
    username: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String
    },
    joinedEarthMeta: {
        type: Boolean,
        default: true
    },
    tookReward: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const DiscordUser = mongoose.model('DiscordUsers', DiscordUserSchema);

module.exports = DiscordUser;