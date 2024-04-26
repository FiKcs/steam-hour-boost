const steamUser = require('steam-user');
const steamTotp = require('steam-totp');
const keeprunning = require('./keeprunning.js')
const fs = require('fs');
const axios = require('axios');

var accounts = fs.readFileSync('accounts.txt', 'utf-8').split('\n');
var games = [730]; // GAMES | Put the steam app id from the game's url. Example: store.steampowered.com/app/578080/ >> var games = [578080];
var status = 1; // ACCOUNT STATUS | 1 = Online, 7 = Invisible
var isRunning = false;

const discordWebhookURL = 'https://webhook.site/48c2bbd0-f876-46cf-976c-fda507af0fd7'; // WEBHOOK LOGGING | This is used if you want to receive a message in through a webhook. For discord:  Go to 'Server Settings'> 'APPS>Integrations>Webhooks>View Webhooks>New Webhook', click on it, change the channel and rename it if you want to, and 'Copy Webhook URL'. Paste the webhook url above. Leave it blank if you do not need it.

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
  if (!isRunning) {
    isRunning = true;
    let connectedAccounts = 0;
    let totalAccounts = accounts.length;

    accounts.forEach((account, index) => {
      let accountDetails = account.split(':');
      let username = accountDetails[0];
      let password = accountDetails[1];
      let shared_secret = accountDetails[2];

      setTimeout(() => {
        let user = new steamUser();
        let logOnOptions = { "accountName": username, "password": password };

        if (shared_secret) {
          logOnOptions.twoFactorCode = steamTotp.generateAuthCode(shared_secret);
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
          user.setPersona(status);
          user.gamesPlayed(games);
        });
      }, index * 500);
    });
  } else {
    console.log("The bot is already running.");
  }
}

startBot();
