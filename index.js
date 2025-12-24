const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// 1. Web Server for Render & UptimeRobot pings
app.get('/', (req, res) => res.send('Bot is active and RTPing every 5 mins!'));
app.listen(10000, () => console.log('Web server running on port 10000'));

// 2. Bot Configuration
const botPassword = "YOUR_BOT_PASSWORD_HERE"; 
const botArgs = {
  host: 'mcinfernoooo.falixsrv.me', 
  port: 25565,           
  username: 'AFK_Bot',   
  version: false        // Auto-detects server version
};

let bot;

function createBot() {
  bot = mineflayer.createBot(botArgs);

  bot.on('spawn', () => {
    console.log('Bot spawned. AFK system engaged.');
  });

  // 3. The /rtp Loop (Every 5 minutes)
  setInterval(() => {
    if (bot && bot.entity) {
      // Adding a tiny bit of random movement before RTP
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
        bot.chat('/rtp');
        console.log(`[${new Date().toLocaleTimeString()}] Sent /rtp`);
      }, 1000);
    }
  }, 300000); // 300,000ms = 5 minutes

  // 4. Auto-Auth (Handles /register and /login)
  bot.on('messagestr', (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('/register')) {
      bot.chat(`/register ${botPassword} ${botPassword}`);
    } else if (msg.includes('/login')) {
      bot.chat(`/login ${botPassword}`);
    }
  });

  // 5. Auto-Reconnect if kicked/server restarts
  bot.on('end', () => {
    console.log('Disconnected. Reconnecting in 10 seconds...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => console.log('Connection Error:', err));
}

createBot();
