/*import dependencies*/
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const dotenvExpand = require('dotenv-expand');
const env = require("dotenv");
const myEnv = env.config();
dotenvExpand.expand(myEnv);

/*import files*/
const discordUserRoutes = require('./routes/DiscordUserRoutes');
const telegramUserRoutes = require('./routes/TelegramUserRoutes');
const facebookUserRoutes = require('./routes/FacebookUserRoutes');
/*import middleware*/
const handleError = require("./middlewares/handleError");
//import telegram triggers
const { triggerGroupId, triggerNewMember, triggerLeftMember } = require("./telegramBot");
/*start the app instance*/
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "https://spa.earthmeta.ai"
})); 

/*routes usage*/
app.use('/auth/facebook', facebookUserRoutes);
app.use('/auth/telegram', telegramUserRoutes);
app.use('/auth/discord', discordUserRoutes);
app.use('*', (req, res) => res.send("Invalid Route"));

/*connect to db and listen to requests*/
mongoose.connect(process.env.DB_URI)
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`connected to db & start listening on port ${process.env.PORT}`);
    })})
.catch((err) => {
    console.log(err.message);
})

/*error handling middleware auth middleware*/
app.use(handleError);