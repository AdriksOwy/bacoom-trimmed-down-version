import { GuildMember, TextChannel } from 'discord.js';
import { IPlayer } from '../models/player';
import { Raids } from '../models/raid';
import moment from 'moment';
import { ServerConfigs } from '../models/server-config';
import SendOrEditEmbed from '../messages/embeds/raids/main';
import { PlayerJoinedRaid } from './handle-logs';

export default async function AddPlayerToRaid(
  channelId: string,
  member: GuildMember,
  specialistIds: number[]
): Promise<{ status: boolean; message: string }> {
  // finding the Raid and Config object in the database
  const raid = await Raids.findOne({ channelId });

  const serverConfig = await ServerConfigs.findOne({
    serverId: member.guild.id,
  });

  if (!raid || !serverConfig) {
    return { status: false, message: 'Coś poszło nie tak...' };
  }

  // assigning a player to a variable
  const player = {
    userId: member.id,
    speciailistIds: specialistIds,
  } satisfies IPlayer;

  let whereToAdd = 'players';

  // checking the player for the right roles for specific marathons
  const anineRaids = ['arma', 'pollutus', 'ultimate arma'];

  if (anineRaids.includes(raid.name)) {
    if (!member.roles.cache.has(serverConfig.anineRoleId)) {
      return {
        status: false,
        message:
          'Nie możesz wstąpić do maratonu a9.\nMusisz spełniać odpowiednie wymagania maratonów (posiadać rolę a9).\n\nYou cannot join a9 marathon. You must have the appropriate requirements (a9 role).',
      };
    }
  }

  if (raid.name === 'alzanor') {
    if (
      (raid.players.find(p => p.userId === player.userId) ||
        raid.reservePlayers.find(p => p.userId === player.userId)) &&
      !member.roles.cache.has(serverConfig.alzanorRoleId)
    ) {
      return {
        status: false,
        message:
          'Nie możesz ponownie wstąpić do maratonu Alzanora.\nMusisz spełniać odpowiednie wymagania (posiadać rolę alza1+1).\n\nYou cannot rejoin the Alzanor marathon. You must have the appropriate requirements (alza1+1 role).',
      };
    }
  }

  if (raid.name === 'valehir') {
    if (
      (raid.players.find(p => p.userId === player.userId) ||
        raid.reservePlayers.find(p => p.userId === player.userId)) &&
      !member.roles.cache.has(serverConfig.valehirRoleId)
    ) {
      return {
        status: false,
        message:
          'Nie możesz ponownie wstąpić do maratonu Valehira.\nMusisz spełniać odpowiednie wymagania (posiadać rolę vale1+1).\n\nYou cannot rejoin the Valehir marathon. You must have the appropriate requirements (vale1+1 role).',
      };
    }
  }
  // adding a player to the reserve list when the priority is still ongoing and the player is not a member of the family
  if (
    raid.name === 'ultimate arma' &&
    member.roles.cache.has(serverConfig.ultimatearmaRoleId)
  ) {
    whereToAdd = 'players';

    await raid.save();
  } else if (moment(raid.priorityEnd).unix() > moment().utc().unix()) {
    if (
      !member.roles.cache.has(serverConfig.familyRoleId) &&
      !member.roles.cache.has(serverConfig.trailRoleId)
    ) {
      whereToAdd = 'reservePlayers';

      await raid.save();
    }
  }

  // checking that the main and reserve lists are full
  if (raid.players.length >= raid.playersCount) {
    if (raid.reservePlayers.length >= raid.playersCount) {
      return {
        status: false,
        message: 'Brak miejsc w maratonie / Lack of places in the marathon.',
      };
    }

    whereToAdd = 'reservePlayers';
  }

  // adding a player to the main list
  if (whereToAdd === 'players') {
    raid.players.push(player);
    raid.markModified('players');

    await raid.save();
  } else if (whereToAdd === 'reservePlayers') {
    raid.reservePlayers.push(player);
    raid.markModified('reservePlayers');

    await raid.save();
  }

  await SendOrEditEmbed(
    raid,
    member.guild.channels.cache.get(channelId) as TextChannel
  );

  // logs - adding user to marathon
  await PlayerJoinedRaid(raid, member);

  return { status: true, message: 'Wszystko git' };
}
