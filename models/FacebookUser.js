const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FacebookUserSchema = new Schema({
    facebookID: {
        type: String,
        required: true,
        unique: true
    }, 
    displayName: {
        type: String,
        required: true,
    },
    likedEM: {
        type: Boolean,
        required: true,
        default: false
    },
    tookReward: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const FacebookUser = mongoose.model('FacebookUsers', FacebookUserSchema);

module.exports = FacebookUser;