Still working on the Readme...

# Discord auth service

In this backend service made using:
- NodeJS
- ExpressJS
- MongoDB

# How to run the project

use the command npm run dev to run the entry point of the backend, default port will be 4000, also you need to set up a .env file that has the same vars as the .env.example file and put all necessary keys and creds.

# Details

the main purpose of this service is to check users rewards, which means if they joined or not, in other words, we check using this services if they have the right to take the reward or not, you will find here:
- telegram users check
- discord users check and auth
- facebook users check and auth
- twitter users check (still under maintenance...)

the backend currently hosted in a render project here is the link: https://sem-5xoe.onrender.com
*Note that the backend can be running slowley because it's using a freetrial only, the backend can take some time to work, don't panic.

# 1- Telegram (/auth/telegram)

I've set a telegram bot to check users joining and user leaving, using the "on chat members" listner, so it will register the username, his first name and if currently joined the chat or not, in case he did, the joinedEM will be false, there's also a field called tookReward and this is to prevent the same user from taking the reward again or another person who write other user username, in the frontend we check if he didn't took the rewards or he joined the group or not, in case he joined and didn't took the reward yet, we confirm to the laravel backend that the user took the reward and then update this service (tookReward => true), we can also get the list of users joined, not that I've sanitized and filtred the query selction to avoid any NoSQL Injection.

- get all telegram users joined the chat -> GET /auth/telegram/ (activated only in test mode)
- update a specific user's info -> PATCH /auth/telegram?username={username}
- check if a user joined the chat -> GET /auth/telegram?username={username}

# 2- Facbeook (/auth/facebook)

We prepare a facbook application using a facebook developer account, and a facebook buissness account, we setup all requirment and we can use the appID and appSecret shown in the .env.example to connect the app to the backend and do the validation, I've used passport.js to work on the auth of the user with the facebook app, same principe as the one we've used on telegram, a user click verify, a LocalStorage value will be stored, now user auth and get back to app we use the LS value stored to check if the user has comeback from a verification if he did then we can check with the laravel backend to confirm the verification alongside path the /me endpoint for this service confirmation.

- get all telegram users joined the chat -> GET /auth/facebook/ (activated only in test mode)
- user redirect auth -> GET /auth/facebook/login (login to the account and validation the auth)
- current user state -> GET /auth/facebook/me (if there's current authed user and can take the reward (Likes the page...) then it will return the user facebook id else it will return error message)
- update a specific user's info -> PATCH /auth/facebook/me (such as change the tookReward value)

# 3- Discord (/auth/discord)

We have two cases in the Discord auth, the first one is to connect the user from the settings (we will use the query named type=settings) or the second one in which we verifiy if he took the reward or not (no query)

*In total we have the two scenario cases:
- user verify his account first and whether he has or hasn't the reward conditions then he go to rewards to verify it after joining the server.
- user verify his reward first if it's success then he will connect automatically if it's a valid account (not duplicated).

We prepare a discord developers application, we set up it configurations and we get it creds and insert it as required on the .env.example file

The Discord code part consists of functions that facilitate user authentication and interaction with the Discord API. Here's a breakdown of the key components:

- get all telegram users joined the chat -> GET /auth/discord/ (activated only in test mode)

- discordAuthLogin: -> GET /auth/discord/login (activated only in test mode)
    A function that handles the initial authentication request.
    It redirects the user to an appropriate URL based on the "type" query parameter.

- discordAuthCallback:
    Handles the callback from Discord after the user authorizes the application.
    Processes the authorization code and fetches user data.
    Verifies the user's authorization, updates or creates user records, and generates a JWT token for authentication.
    Redirects the user back to an appropriate URL.

- discordAuthMe: -> GET /auth/discord/me
    Verifies the current user's authentication token.
    Checks if the user exists and has taken certain actions.
    Responds with user information or relevant errors.

- discordUpdateAuthMe: -> PATCH /auth/discord/me
    Handles updating the user's status, specifically setting the "tookReward" attribute to true.
    Verifies the current user and updates the record accordingly.

The code employs a local "currentToken" variable to temporarily store user authentication tokens due to potential issues with cookies. It communicates with the Discord API to perform authentication and retrieve user information. It utilizes Axios for making HTTP requests.

The code also involves interacting with a database (possibly MongoDB based on the usage of DiscordUser). It checks for existing users, updates user records, and creates new records as needed.

Error handling is present, and if any issues arise during the process, errors are appropriately caught and forwarded to the next middleware.

Remember to provide proper configuration values in the environment variables (e.g., DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET and otjher Discord related keys) for the code to function correctly.

# 4- Twitter (/auth/twitter)

The service is under maintainance since the twitter api forces the users to pay money in order to get simple features such as see the list of followers, this is the list of endpoints made alongside the DB schema

- get all twitter users liked the page -> GET /auth/twitter/ (activated only in test mode)
- user redirect auth -> GET /auth/twitter/login (login to the account and validation the auth)
- current user state -> GET /auth/twitter/me (if there's current authed user and can take the reward (Likes the page...) then it will return the user twitter id else it will return error message)