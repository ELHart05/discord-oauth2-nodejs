const axios = require("axios");
const DiscordUser = require("../models/DiscordUser");
const jwt = require("jsonwebtoken");

const discordAuthLogin = async (req, res) => {
    const url = "https://discord.com/api/oauth2/authorize?client_id=1127227664302870538&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify%20guilds%20email%20guilds.join";
    res.redirect(url);
} 

const discordAuthCallback = async (req, res, next) => {
    const { code, error, error_description } = req.query;

    try {

        if (error) {
            throw new Error(error_description);
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

            res.status(201);
        } else {
            const newUser = new DiscordUser({
                username, avatar,
                discordID: id,
                joinedEarthMeta: guilds.some((guild) => (
                    guild.id === "933927321080037407" && guild.name === "EarthMeta 🌎"
                ))
            });
    
            result = await newUser.save();
            res.status(200);
        }

        const token = await jwt.sign({sub: id}, process.env.JWT_SECRET_KEY, {
            expiresIn: '1d'
        })

        res.cookie('token', token);

        res.redirect(`${process.env.DISCORD_FINAL_REDIRECT}`)

    } catch (error) {
        next(error, 500);
    }
}

const discordAuthMe = async (req, res, next) => {
    if (req.user === null) {
        res.status(500).send({
            error: "error"
        })
    }   else {
        res.status(200).send(req.user);
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
    discordAuthMe,
    discordAuthGetall
}