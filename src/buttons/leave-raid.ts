import { ButtonInteraction, GuildMember, TextChannel } from 'discord.js';
import GetButtonScheme from '../buttons-schemas/leave-raid';
import { defaultEmbed } from '../messages/embeds/default';
import { Raids } from '../models/raid';
import RemovePlayerFromRaid from '../utils/remove-player-from-raid';
import ReplacedPlayersMessage from '../messages/embeds/raids/replaced-players';

// button requirements
export const data = GetButtonScheme(false);

export async function execute(interaction: ButtonInteraction) {
  // finding the Raid object in the database
  const raid = await Raids.findOne({ channelId: interaction.channelId });

  // checking if the "raid" variable has been correctly initialised
  if (!raid) {
    const errorEmbed = defaultEmbed(
      '❌ Coś poszło nie tak...',
      'Nie znaleziono maratonu / Marathon not found.'
    );

    return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }

  // deleting the user from the marathon and sending the appropriate message
  const replacedPlayers = await RemovePlayerFromRaid(
    interaction.guild!,
    interaction.channelId,
    interaction.user.id
  );

  const successfulEmbed = defaultEmbed(
    '✅ Pomyślnie wykonano komendę!',
    'Wyszedłeś/aś z maratonu / You left the marathon.'
  );

  const leftPlayer = interaction.member as GuildMember;

  return await Promise.all([
    interaction.reply({ embeds: [successfulEmbed], ephemeral: true }),
    interaction.channel?.send(
      `🙁 ${leftPlayer} opuścił/a maraton / signed out of the marathon!`
    ),
    ReplacedPlayersMessage(replacedPlayers, interaction.channel as TextChannel),
  ]);
}
