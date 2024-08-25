import {
  AutocompleteInteraction,
  CategoryChannel,
  ChannelType,
  CommandInteraction,
  GuildMember,
  TextChannel,
} from 'discord.js';
import { IRaid, Raids } from '../models/raid';
import { HydratedDocument } from 'mongoose';
import GetCommandScheme from '../commands-schemas/raid';
import reply from '../messages/reply';
import { ServerConfigs } from '../models/server-config';
import moment from 'moment-timezone';
import SendOrEditEmbed from '../messages/embeds/raids/main';
import raids from '../raids.json';
import { RaidCreated } from '../utils/handle-logs';

// command requirements
export const data = GetCommandScheme();

// autocomplete marathon name
export async function autocomplete(interaction: AutocompleteInteraction) {
  const focusedOption = interaction.options.getFocused(true);

  if (focusedOption.name !== 'raid') {
    return;
  }

  const choices = raids.map(r => r.name).sort();
  const filtered = choices.filter(c => c.includes(focusedOption.value));
  let options;

  if (filtered.length > 25) {
    options = filtered.slice(0, 25);
  } else {
    options = filtered;
  }

  await interaction.respond(options.map(o => ({ name: o, value: o })));
}

// command interaction
export async function execute(interaction: CommandInteraction) {
  if (interaction.deferred || interaction.replied) {
    return;
  }

  // assignment of user
  const member = interaction.member as GuildMember;

  // checking if "config" has been configured
  const serverConfig = await ServerConfigs.findOne({
    serverId: interaction.guildId?.toString(),
  });

  if (!serverConfig) {
    return reply(interaction, 'Nie znaleziono konfiguracji serwera.', 'error');
  }

  // checking if someone has the roles of leader
  if (!member.roles.cache.has(serverConfig.leaderRoleId)) {
    return reply(interaction, 'Nie masz odpowiednich uprawnień!', 'warning');
  }

  // Assigning interaction parameter values to variables
  const options = interaction.options;
  const name = options.get('raid', true).value as string;
  const author = options.get('author', true).user as unknown as GuildMember;
  const day = options.get('day', true).value as number;
  const month = options.get('month', true).value as number;
  const hour = options.get('hour', true).value as string;
  const duration = options.get('number_of_hours', true).value as number;
  const meeting = options.get('meeting', true).value as string;
  const contribution = options.get('contribution', true).value as string;
  const levelRequirement = options.get('level_requirement', true)
    .value as string;
  const priority = options.get('priority', true).value as number;
  const additionalInfo = options.get('additional_info')?.value ?? 'Brak';

  // validation of individual requirements
  if (duration <= 0) {
    return reply(interaction, 'Nieprawidłowa ilość godzin.', 'error');
  }

  const hourRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  if (!hourRegex.test(hour)) {
    return reply(interaction, 'Nieprawidłowy format godziny.', 'error');
  }

  const raidInfo = raids.find(r => r.name === name);

  if (!raidInfo) {
    return reply(
      interaction,
      'Nie znaleziono rajdu o podanej nazwie.',
      'error'
    );
  }

  const formattedLevelRequirement = levelRequirement.replace(/,/g, '\n-');

  // assigning categories for channels
  const category = interaction.guild?.channels.cache.get(
    serverConfig.raidsCategoryId
  ) as CategoryChannel;

  // additional channel validation
  if (!category) {
    return reply(
      interaction,
      'Wystąpił błąd podczas tworzenia kanału.',
      'error'
    );
  }

  // changing the time format from ":" to "-" for the channel name
  const formattedHour = hour.replace(':', '-');

  // creation of a channel
  const channelTitle = `${raidInfo?.icon}${name}-${day}-${month}⏰${formattedHour}-${duration}h`;

  const newChannel = (await category.guild.channels.create({
    name: channelTitle,
    type: ChannelType.GuildText,
    parent: serverConfig.raidsCategoryId,
  })) as TextChannel;

  // storing in a variable the date of creation of the list
  const date = moment
    .tz(
      `${moment().year()}-${month}-${day} ${hour}`,
      'YYYY-MM-DD HH:mm',
      'Europe/Warsaw'
    )
    .utc();

  // sending a marathon message
  // creation of a "raid" object, and then saving it in the database
  const raid: HydratedDocument<IRaid> = new Raids({
    name,
    guildId: interaction.guildId,
    authorId: author.id,
    channelId: newChannel.id,
    messageId: null,
    date: date.toDate(),
    duration,
    meeting,
    contribution,
    playersCount: raidInfo?.playersCount || 15,
    levelRequirement: formattedLevelRequirement,
    priorityEnd: moment().add(Math.floor(priority), 'hours').toDate(),
    additionalInfo,
    players: [],
    reservePlayers: [],
  });

  const messageId = await SendOrEditEmbed(raid, newChannel);
  raid.messageId = messageId;

  await Raids.create(raid);

  // logs - marathon creating
  await RaidCreated(raid, member);

  // sending a message about the successful creation of the marathon
  return reply(interaction, 'Maraton został pomyślnie utworzony!', 'success');
}
