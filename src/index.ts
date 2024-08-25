import {
  Client,
  GatewayIntentBits,
  Collection,
  Interaction,
  ClientOptions,
  ActivityType,
} from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import mongoose from 'mongoose';
import reply from './messages/reply';
import handleRaidsTime from './utils/handle-raids-time';
import delay from './utils/delay';
import handleOffensesTime from './utils/handle-offenses-time';

// the definition of the interface "BotClient", which extends the class "Client"
interface BotClient extends Client {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commands: Collection<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  buttons: Collection<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectMenus: Collection<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modals: Collection<string, any>;
}

// building and configuring application
config();
process.chdir('./dist');

// discord.js client initialization and loading commands from files and storing them in a collection
const clientOptions: ClientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
};

const client: BotClient = new Client(clientOptions) as BotClient;

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const buttonFiles = fs
  .readdirSync('./buttons')
  .filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const button = require(`./buttons/${file}`);
  client.buttons.set(button.data.data.custom_id, button);
}

const selectMenusFiles = fs
  .readdirSync('./select-menus')
  .filter(file => file.endsWith('.js'));

for (const file of selectMenusFiles) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const selectMenu = require(`./select-menus/${file}`);
  client.selectMenus.set(selectMenu.customId, selectMenu);
}

const modalsFiles = fs
  .readdirSync('./modals')
  .filter(file => file.endsWith('.js'));

for (const file of modalsFiles) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const modal = require(`./modals/${file}`);
  client.modals.set(modal.data.data.custom_id, modal);
}

// successful turn on bot
client.once('ready', async () => {
  // database connection
  await mongoose.connect(process.env.DB!);

  console.log('BOT has been activated!');

  // array with bot activities
  const activities = [
    { name: 'NosTale', type: ActivityType.Playing },
    { name: 'NosTale', type: ActivityType.Listening },
    { name: 'NosTale', type: ActivityType.Streaming },
    { name: 'NosTale', type: ActivityType.Watching },
  ];

  // timer to change bot activity
  setInterval(() => {
    const random = Math.floor(Math.random() * activities.length);
    const { name, type } = activities[random];

    client.user?.setActivity(name, { type });
  }, 5000);

  // registration of commands (slash commands)
  const commands = client.commands.map(command => command.data);

  await client.application?.commands.set(commands);

  while (true) {
    handleRaidsTime(client);
    handleOffensesTime(client);

    await delay(60000);
  }
});

// client on - interaction with command
client.on('interactionCreate', async (interaction: Interaction) => {
  // second check is for test only
  if (!interaction.inGuild()) {
    return;
  }

  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);

      return reply(
        interaction,
        'Wystąpił błąd podczas wykonywania tego polecenia!',
        'error'
      );
    }
  }
});

// client on - interaction with button
client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.inGuild()) {
    return;
  }

  if (interaction.isButton()) {
    const button = client.buttons.get(interaction.customId);

    if (!button) return;

    try {
      await button.execute(interaction);
    } catch (error) {
      console.error(error);

      return reply(
        interaction,
        'Wystąpił błąd podczas wykonywania tego przycisku!',
        'error'
      );
    }
  }
});

// client on - interaction with autocomplete
client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.inGuild()) {
    return;
  }

  if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error(error);
    }
  }
});

// client on - interaction with select menu
client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.inGuild()) {
    return;
  }

  if (interaction.isAnySelectMenu()) {
    let customId = interaction.customId;

    if (interaction.customId.includes('specialist-select')) {
      customId = 'specialist-select';
    }

    const selectMenu = client.selectMenus.get(customId);

    if (!selectMenu) return;

    try {
      await selectMenu.execute(interaction);
    } catch (error) {
      console.error(error);
    }
  }
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.inGuild()) {
    return;
  }

  if (interaction.isModalSubmit()) {
    const modal = client.modals.get(interaction.customId);

    if (!modal) return;

    try {
      await modal.execute(interaction);
    } catch (error) {
      console.error(error);

      return reply(
        interaction,
        'Wystąpił błąd podczas wykonywania tego modalu!',
        'error'
      );
    }
  }
});

// token bot
client.login(process.env.BOT_TOKEN);
