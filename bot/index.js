require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// Load command files dynamically
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(fileName => fileName.endsWith('.js'));

  for (const fileName of commandFiles) {
    const filePath = path.join(commandsPath, fileName);
    const command = require(filePath);
    if (command && command.data && command.execute) {
      client.commands.set(command.data.name, command);
    }
  }
}

// Load event files dynamically
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter(fileName => fileName.endsWith('.js'));

    for (const fileName of eventFiles) {
        const filePath = path.join(eventsPath, fileName);
            const event = require(filePath);
            if (event && event.name && typeof event.execute === 'function') {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args));
                } else {
                    client.on(event.name, (...args) => event.execute(...args));
      }
        }
    }
}

client.login(process.env.DISCORD_TOKEN);
