## Discord bot commands setup

### Prerequisites
- Create a Discord application and bot, invite it with scopes: `bot applications.commands`.
- In the Dev Portal, enable the intents you use. This project uses `Guilds`, `GuildMessages`, and `MessageContent`.

### Quick start

```
npm install
# set env in bot/.env (see below)
npm run deploy:commands
npm run start
```

### Environment
Copy `bot/.env.example` to `bot/.env` and fill in the values.

```env
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_application_client_id
GUILD_ID=your_optional_guild_id_for_guild_scoped_command_deploy
API_URL=http://localhost:5000
BOT_API_KEY=your_bot_api_key
```

- `DISCORD_TOKEN` is required to log in the bot.
- `DISCORD_CLIENT_ID` is used by `npm run deploy:commands`.
- `GUILD_ID` is optional and can be used for instant guild-scoped command registration.
- `API_URL` should point to your running backend.
- `BOT_API_KEY` must match `BOT_API_KEY` on the backend server for authenticated bot API requests.

### Scripts
- `npm run start`: start the bot
- `npm run dev`: start with auto-reload (nodemon)
- `npm run deploy:commands`: register slash commands (run this after adding/editing commands)

### Folder structure
- `commands/`: One file per slash command exporting `{ data, execute }`.
- `events/`: Discord event handlers exporting `{ name, once?, execute }`.
- `index.js`: Bootstraps the client, loads commands and events.
- `deploy-commands.js`: Registers slash commands from `commands/`.

### Create a new command
Add a file under `commands/`, for example `hello.js`:

```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Say hello'),
  async execute(interaction) {
    await interaction.reply('Hello!');
  },
};
```

Then register it and start the bot:

```
npm run deploy:commands
npm run start
```




