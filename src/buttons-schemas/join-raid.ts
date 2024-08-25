import { ButtonBuilder } from 'discord.js';
import { ButtonStyle } from 'discord.js';

// button schema
export default function JoinRaidButtonScheme() {
  return new ButtonBuilder()
    .setCustomId('join-raid')
    .setLabel('✅ Zapisz się / Sign up')
    .setStyle(ButtonStyle.Primary);
}
