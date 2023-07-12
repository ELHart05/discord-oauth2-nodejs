const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot('6012285766:AAEXboXwSJleNdBSCGHt9R_yIGtF3Ip04-U', { polling: true });

// Replace 'GROUP_CHAT_ID' with the ID of the group chat where the user is a member
const groupChatId = '948941851';
// Replace 'USERNAME' with the username you want to convert (without the '@' symbol)
const username = '@username';

bot.getChatMember(groupChatId, username).then((chatMember) => {
  const userId = chatMember.user.id;
  console.log(`User ID for @${username}: ${userId}`);
}).catch((error) => {
  console.log(`Failed to convert username to user ID: ${error.message}`);
});