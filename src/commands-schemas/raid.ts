import { SlashCommandBuilder } from 'discord.js';

// command schema
export default function GetCommandScheme() {
  return new SlashCommandBuilder()
    .setName('raid')
    .setDescription('Stworzenie maratonu.')
    .addStringOption(option =>
      option
        .setName('raid')
        .setDescription('Nazwa maratonu (np. alzanor, arma).')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addUserOption(option =>
      option
        .setName('author')
        .setDescription('Twórca maratonu (np. @Erdbeere).')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('day')
        .setDescription('Dzień maratonu (np. 4, 11, 26).')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('month')
        .setDescription('Miesiąc maratonu (np. 2, 6, 12).')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('hour')
        .setDescription('Godzina rozpoczęcia maratonu (np. 11:00, 19:30).')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('number_of_hours')
        .setDescription('Czas trwania maratonu podany w godzinach (np. 1, 2).')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('priority')
        .setDescription('Pierwszeństwo podane w godzinach (np. 12, 24).')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('meeting')
        .setDescription('Zbiórka ludzi (np. Ain ch5 21:50).')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('contribution')
        .setDescription('Potrzebna składka (np. 2 pieki na osobę).')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('level_requirement')
        .setDescription('Wymagania poziomowe (np. 60aw 1+0, 80aw 1+1).')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('additional_info')
        .setDescription('Dodatkowe informacje (np. Nie spóźniać się!).')
        .setRequired(false)
    )
    .toJSON();
}
