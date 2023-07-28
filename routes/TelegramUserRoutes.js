const { Router } = require("express");
const { getTelegramUser, activateUserUsed } = require("../controllers/TelegramUserController")

const router = Router();

//get all telegram users (not bots) in the telgram group with the ID specified
router.get('/', getTelegramUser);

router.patch('/', activateUserUsed)

module.exports = router;