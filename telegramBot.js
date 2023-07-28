const TelegramBot = require('node-telegram-bot-api');
const TelegramUser = require("./models/TelegramUser")
require("dotenv").config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

let groupChatId = process.env.TELEGRAM_GROUP_ID;



if(bot.isPolling()) {
  await bot.stopPolling();
}

await bot.startPolling();


//send to the bot "/getGroupId" on the group chat in case don't have the group chatId
const triggerGroupId = bot.onText(/\/getGroupId/, (msg) => {
  groupChatId = msg.chat.id;
  // Send the group chat ID as a reply
  bot.sendMessage(groupChatId, `The Group Chat ID is: ${groupChatId}`);
});

//triger the entry of new member
const triggerNewMember = bot.on('new_chat_members', async (msg) => {

  const { id, first_name, is_bot, username } = msg.new_chat_member;

  if (!is_bot) {

  const userExists = await TelegramUser.findOne({ telegramID: id });

  if (userExists) {
    await TelegramUser.findOneAndUpdate({ telegramID: id }, {
      telegramID: id,
      firstName: first_name,
      username: (username === undefined) ? "undefined" : username //there's some users without username, if no username then null,
    })
  } else {
    const newUser = new TelegramUser({
      telegramID: id,
      firstName: first_name,
      username: (username === undefined) ? "undefined" : username
    })
    await newUser.save();
  }

  // bot.sendMessage(msg.chat.id, `Congratulations! ${username} (ID: ${id}) has joined the group chat, added to the DB`); just in test mode
  bot.sendMessage(msg.chat.id, `Congratulations! ${first_name} has joined the group chat`);
  
}});

await bot.stopPolling();

module.exports = {
  triggerGroupId, triggerNewMember
}