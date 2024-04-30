const steamUser = require('steam-user');
const steamTotp = require('steam-totp');
const keeprunning = require('./keeprunning.js')
const axios = require('axios');

const games = process.env.games.split(',').map(id => parseInt(id.trim()));
const accounts = process.env.accounts.split(',');
const discordWebhookURL = process.env.webhook;

function sendWebhookMessage(message) {
  if (!discordWebhookURL) {
    console.log("No webhook URL specified. Skipping message sending.");
    return;
  }

  axios.post(discordWebhookURL, { content: message })
    .then(response => {
      console.log("Webhook message sent:", message);
    })
    .catch(error => {
      console.error("Error sending webhook message:", error);
    });
}

function startBot() {
  let connectedAccounts = 0;
  const totalAccounts = accounts.length;

  accounts.forEach(account => {
    const [username, password, sharedSecret] = account.split(':');
    const user = new steamUser();
    const logOnOptions = { "accountName": username, "password": password };

    if (sharedSecret) {
      logOnOptions.twoFactorCode = steamTotp.generateAuthCode(sharedSecret);
    }

    user.logOn(logOnOptions);

    user.on('loggedOn', () => {
      if (user.steamID != null) {
        console.log(`Account ${username} connected.`);
        connectedAccounts++;

        if (connectedAccounts === totalAccounts) {
          sendWebhookMessage("All accounts connected.");
        }
      } else {
        console.log(`Error logging in to account ${username}`);
        sendWebhookMessage(`Error logging in to account ${username}`);
      }
      user.setPersona(1); // Online status
      user.gamesPlayed(games);
    });
  });
}

startBot();
