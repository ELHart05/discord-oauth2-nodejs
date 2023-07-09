const jwt = require("jsonwebtoken");
const DiscordUser = require("../models/DiscordUser");

const verifyAuth = async (req, res, next) => {
    
    const token = req.cookies.token;

    try {

        if (!token) {
            req.user = null;
            await next();
            return;
        }
        
        const { sub } = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        const currentUser = await DiscordUser.findOne({ discordID: sub });

        req.user = currentUser;

        await next();

    } catch (err) {

        req.user = null;
    
        next(err);
        
    }
}

module.exports = verifyAuth;