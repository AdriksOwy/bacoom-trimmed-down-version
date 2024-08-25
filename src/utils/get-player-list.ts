import { IRaid } from '../models/raid';
import specialists from '../specialists.json';

export default function GetPlayerList(
  raid: IRaid,
  category: 'players' | 'reservePlayers'
): string[] {
  const playersList = Array(raid.playersCount).fill(null);
  const players = category === 'players' ? raid.players : raid.reservePlayers;

  let idx = 1;

  const list = players.map(player => {
    const playerSpecialists = player.speciailistIds
      .map(id => specialists.find(s => s.id === id)?.sp)
      .join(' / ');
    const text = `\`${idx}.\` <@${player.userId}> - ${playerSpecialists}`;
    idx++;

    return text;
  });

  playersList.splice(0, idx - 1, ...list);

  const emptySlots = playersList.filter(p => p === null);
  const emptySlotsFirstIndex = playersList.indexOf(null);

  if (emptySlotsFirstIndex !== -1) {
    if (emptySlots.length === 1) {
      playersList.splice(emptySlotsFirstIndex, 1, `\`${idx}.\` - Brak gracza.`);
    } else {
      const text = `\`${idx}. ➡️ ${idx + emptySlots.length - 1}.\` - Brak graczy.`;

      playersList.splice(emptySlotsFirstIndex, emptySlots.length, text);
    }
  }

  const result: string[] = [];

  for (let i = 0; i < playersList.length; i += 4) {
    result.push(playersList.slice(i, i + 4).join('\n'));
  }

  return result;
}
