const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InstgagramUserSchema = new Schema({
    instagramID: {
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
        required: true,
        unique: true
    }
}, { timestamps: true });

const InstagramUser = mongoose.model('InstagramUsers', InstgagramUserSchema);

module.exports = InstagramUser;