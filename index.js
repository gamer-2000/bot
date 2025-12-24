const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// 1. Web Server for Render & UptimeRobot pings
app.get('/', (req, res) => res.send('Bot is active and logged in!'));
app.listen(10000, () => console.log('Web server running on port 10000'));

// 2. Bot Configuration
const botPassword = "YOUR_BOT_PASSWORD_HERE"; // Set a password for the bot

const botArgs = {
  host: 'YOUR_SERVER_IP', // e.g. myserver.falix.gg
  port: 25565,           // Your server port
  username: 'AFK_Bot',   // Bot's name
  version: '1.20.1'      // Your server version
};

let bot;

function createBot() {
  bot = mineflayer.createBot(botArgs);

  bot.on('spawn', () => {
    console.log('Bot spawned in the world.');
    // Small jump to prevent AFK kick every 5 mins
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 300000);
  });

  // 3. Auto-Auth (Handles /register and /login)
  bot.on('messagestr', (message) => {
    if (message.includes('/register')) {
      bot.chat(`/register ${botPassword} ${botPassword}`);
      console.log('Sent registration command.');
    } else if (message.includes('/login')) {
      bot.chat(`/login ${botPassword}`);
      console.log('Sent login command.');
    }
  });

  // 4. Auto-Reconnect if kicked
  bot.on('end', () => {
    console.log('Disconnected. Reconnecting in 5 seconds...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => console.log('Error:', err));
}

createBot();
