import { ButtonInteraction } from 'discord.js';
import GetButtonScheme from '../buttons-schemas/join-raid';
import SendSpecialistSelectMessage from '../messages/embeds/raids/specialist-select';
import { UsersOffenses } from '../models/user-offenses';
import reply from '../messages/reply';

// button requirements
export const data = GetButtonScheme();

// selecting the appropriate specialist
export async function execute(interaction: ButtonInteraction) {
  const userOffenses = await UsersOffenses.findOne({
    userId: interaction.user.id,
    serverId: interaction.guild?.id,
  });

  if (userOffenses && userOffenses.offenses.some(o => o.type === 'ban')) {
    return reply(
      interaction,
      'Zostałeś zablokowany, nie możesz dołączyć do maratonu / You have been blocked, you cant join the marathon!',
      'error'
    );
  }

  await SendSpecialistSelectMessage(interaction, 'reply', []);
}
