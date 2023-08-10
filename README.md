Still working on the Readme...

# Discord auth service

in this backend service made using:
- NodeJS
- ExpressJS
- MongoDB

# How to run the project

use the command nodemon app.js to run the entry point of the backend, default port will be 4000, also set up a .env file that has the same vars as the .env.example file and put all necessary keys and creds.

# Details

the main purpose of this service is to check users rewards, which means if they joined we will check using this services if they have the right to take the reward or not, you will find here:
- telegram users check
- discord users check and auth
- facebook users check and auth
- twitter users check

the backend currently hosted in a render project here is the link: https://sem-5xoe.onrender.com
*Note that the backend can be running slowley because it's using a freetrial only, the backend can take some time to work, don't panic.

# 1- Telegram (/auth/telegram)

I've set a telegram bot to check users joining and user leaving, using the "on chat members" listner, so it will register the username, his first name and if currently joined the chat or not, in case he let the joinedEM will be false, there's also a field called tookReward and this is to prevent the same user from taking the reward again or another person who write other user username, in the frontend we check if he didn't took the rewards or he joined the group or not, in case he joined and didn't took the reward yet, then we confirm to the laravel backend that the user took the reward and then update this service, we can also get the list of users joined

get all telegram users joined the chat -> GET /auth/telegram/ (activated only in test mode)
update a specific user's info -> PATCH /auth/telegram?username={username}
check if a user joined the chat -> GET /auth/telegram?username={username}

# 2- Facbeook (/auth/facebook)

We prepare a facbook application using a facebook developer account, and a facebook buissness account, we setup all requirment and we can use the appID and appSecret shown in the .env.example

get all telegram users joined the chat -> /auth/telegram/ (activated only in test mode)
user redirect auth -> /auth/facebook/login
current user state -> /auth/facebook/user (if there's current authed user then it will return the user facebook id else nothing)
