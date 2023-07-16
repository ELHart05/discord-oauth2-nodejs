const { Router } = require("express");
const { getTelegramUsers } = require("../controllers/TelegramUserController")

const router = Router();

//get all telegram users (not bots) in the telgram group with the ID specified
router.get('/', getTelegramUsers);

module.exports = router;