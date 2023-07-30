const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TwitterUserSchema = new Schema({
    twitterID: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    tookReward: {
        type: Boolean,
        default: false
    },
    likedEM: {
        type: Boolean,
        default: false
    }
})

const TwitterUser = mongoose.model('TwitterUsers', TwitterUserSchema);

module.exports = TwitterUser;