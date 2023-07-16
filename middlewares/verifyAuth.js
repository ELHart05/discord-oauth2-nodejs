const jwt = require("jsonwebtoken");
const DiscordUser = require("../models/DiscordUser");


//middleware removed due to the issue of cannot send cookie to another domain
const verifyAuth = async (req, res, next) => {
    
    const token = req.cookies.token;

    try {

        if (token === "Denied") {
            req.user = {
                discordID: "Denied"
            };
            await next();
            return;  
        }

        if (!token) {
            req.user = {
                discordID: -1
            };
            await next();
            return;
        }
        
        const { sub } = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        const currentUser = await DiscordUser.findOne({ discordID: sub });

        req.user = currentUser;

        await next();

    } catch (err) {

        req.user = {
            discordID: "error"
        };
    
        next(err);
        
    }
}

module.exports = verifyAuth;