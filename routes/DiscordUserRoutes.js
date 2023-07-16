const { Router } = require("express");
const { discordAuthLogin, discordAuthCallback, discordAuthGetall, discordAuthMe } = require("../controllers/DiscordUserController");

const router = Router();

/* used to get the login and redirect user to the discord approve page */
router.get('/login', discordAuthLogin);

/* used to get the user infos in cookie and check if joined the earthmeta discord after approving the discord usage */
router.get('/callback', discordAuthCallback);

/* used to get the user infos */
router.get('/me', discordAuthMe);

/* used to get all users guaranteed auth */
router.get('/', discordAuthGetall);

module.exports = router;