import { ButtonBuilder } from 'discord.js';
import { ButtonStyle } from 'discord.js';

// button schema
export default function LeaveRaidButtonSchema(disabled: boolean) {
  return new ButtonBuilder()
    .setCustomId('leave-raid')
    .setLabel(
      disabled
        ? 'Wyjście zablokowane < 15 min. do rozpoczęcia'
        : '❌ Wypis / Sign out'
    )
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(disabled);
}
