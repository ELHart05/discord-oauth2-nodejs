const axios = require("axios");
const DiscordUser = require("../models/DiscordUser");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

let currentToken = ""; //local var to have the last user authed token

const discordAuthLogin = async (req, res) => {
    const url = "https://discord.com/api/oauth2/authorize?client_id=1127227664302870538&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify%20guilds%20email%20guilds.join";
    res.redirect(url);
} 

const discordAuthCallback = async (req, res, next) => {
    const { code, error } = req.query;

    try {

        if (error) {
            //since cookie not working issue we will used local var to affect the cookie and the time we get to the front we get the local var contains token we decode it and fetch the user
            //note that I left the cookie in with the middleware commented in case in future maintain
            res.cookie('token', "Denied");
            currentToken = "Denied";
            res.redirect(`${process.env.DISCORD_FINAL_REDIRECT}`);
            return;
        }
    
        let userData = {};
    
        const params = {
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.DISCORD_CLIENT_REDIRECT
        };
    
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/x-www-form-urlencoded'
        };

        const response = await axios.post("https://discord.com/api/oauth2/token", params, { headers });

        const userResponse = await axios.get("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `Bearer ${response.data.access_token}`,
                ...headers
            }
        })
        const guildsResponse = await axios.get("https://discord.com/api/users/@me/guilds", {
            headers: {
                Authorization: `Bearer ${response.data.access_token}`,
                ...headers
            }
        })

        userData = { ...userResponse.data, guilds: guildsResponse.data};

        const { id, username, avatar, guilds } = userData;

        const userExists = await DiscordUser.findOne({ discordID: id });

        let result;
        
        if (userExists) {
            result = await DiscordUser.findOneAndUpdate({ discordID: id }, {
                username, avatar,
                joinedEarthMeta: guilds.some((guild) => (
                    guild.id === "933927321080037407" && guild.name === "EarthMeta 🌎"
                ))
            });

            res.status(200);
        } else {
            const newUser = new DiscordUser({
                username, avatar,
                discordID: id,
                joinedEarthMeta: guilds.some((guild) => (
                    guild.id === "933927321080037407" && guild.name === "EarthMeta 🌎"
                ))
            });
    
            result = await newUser.save();
            res.status(201);
        }

        const token = await jwt.sign({sub: id}, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d'
        })

        res.cookie("token", token);

        currentToken = token;

        res.redirect(`${process.env.DISCORD_FINAL_REDIRECT}`);

    } catch (error) {
        next(error);
    }
}


const discordAuthMe = async (req, res, next) => {
    try {
        
        if (currentToken === "Denied") {
            return res.status(200).send({
                discordID: "Denied"
            });
        }

        if (!currentToken) {
            return res.status(200).send({
                discordID: -1
            });
        }
        
        const { sub } = await jwt.verify(currentToken, process.env.JWT_SECRET_KEY);

        const currentUser = await DiscordUser.findOne({ discordID: sub });

        if (!currentUser) {
            return res.status(200).send({
                discordID: -1
            });
        }

        res.status(200).send(currentUser);

        currentToken = "";

    } catch (err) {
        next(err);
    }
}

const discordAuthGetall = async (req, res, next) => {
    try {
        
        const allAuths = await DiscordUser.find();

        res.status(200).send(allAuths)

    } catch (err) {
        next(err);
    }
}

module.exports = {
    discordAuthLogin,
    discordAuthCallback,
    discordAuthGetall,
    discordAuthMe
}