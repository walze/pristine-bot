import * as dotenv from 'dotenv';
dotenv.config();

import {Client, GatewayIntentBits, REST, Routes} from 'discord.js';
import assert from 'assert';

const {TOKEN, CLIENT_ID} = process.env;
assert(TOKEN, 'TOKEN is not defined');
assert(CLIENT_ID, 'CLIENT_ID is not defined');

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];

const rest = new REST({version: '10'}).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({intents: [GatewayIntentBits.Guilds]});
client.login(TOKEN);

client.on('ready', () => {
  const {user} = client;
  assert(user, 'Login failed!!');

  console.log(`Logged in as ${user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});
