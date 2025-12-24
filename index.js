const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// 1. Web Server to keep Render happy
app.get('/', (req, res) => res.send('Bot is alive!'));
app.listen(10000, () => console.log('Web server running on port 10000'));

// 2. Minecraft Bot Settings
const bot = mineflayer.createBot({
  host: 'YOUR_SERVER_IP', // e.g., 'myserver.falix.gg'
  port: 25565,           // Your server port
  username: 'AFK_Bot',   // Name of the bot
  version: '1.20.1'      // Use your server's version
});

// Anti-AFK Kick: Move slightly every 5 minutes
setInterval(() => {
  bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 500);
}, 300000);

bot.on('login', () => console.log('Bot joined the server!'));
bot.on('error', (err) => console.log('Error:', err));
bot.on('end', () => console.log('Bot disconnected. Restarting...'));
