import mongoose, { Schema } from 'mongoose';
import { IPlayer } from './player';

// raid model
interface IRaid {
  name: string;
  guildId: string;
  authorId: string;
  channelId: string;
  messageId: string | null;
  date: Date;
  duration: string;
  meeting: string;
  contribution: string;
  playersCount: number;
  levelRequirement: string;
  priorityEnd: Date;
  additionalInfo: string;
  reminderSent: boolean;
  reserveMoved: boolean;
  players: IPlayer[];
  reservePlayers: IPlayer[];
}

const RaidSchema = new Schema<IRaid>({
  name: { type: String, required: true },
  guildId: { type: String, required: true },
  authorId: { type: String, required: true },
  channelId: { type: String, required: true },
  messageId: { type: String, required: false },
  date: { type: Date, required: true },
  duration: { type: String, required: true },
  meeting: { type: String, required: true },
  contribution: { type: String, required: true },
  playersCount: { type: Number, required: true },
  levelRequirement: { type: String, required: true },
  priorityEnd: { type: Date, required: true },
  additionalInfo: { type: String, required: false },
  reminderSent: { type: Boolean, required: true, default: false },
  reserveMoved: { type: Boolean, required: true, default: false },
  players: { type: [Object], required: false },
  reservePlayers: { type: [Object], required: false },
});

const Raids = mongoose.model<IRaid>('Raid', RaidSchema);

export { Raids, IRaid };
