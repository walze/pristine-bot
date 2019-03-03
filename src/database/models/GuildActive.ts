import Sequelize from 'sequelize';
import { sql } from '../db';
import { Guild } from './Guild';
import { User } from './User';

export interface IGuildActive {
  user_id: string,
  guild_id: string;
  messageAvg: number;
  lastMessage: string;
  totalMessages: number;
}

export const GuildActive = sql.define<IGuildActive, IGuildActive>('guild_active', {
  user_id: {
    type: Sequelize.STRING,
    references: {
      model: 'users',
      key: 'id',
    }
  },
  guild_id: {
    type: Sequelize.STRING,
    references: {
      model: Guild,
      key: 'id',
    },
    unique: true
  },
  messageAvg: Sequelize.FLOAT,
  lastMessage: Sequelize.DATE,
  totalMessages: Sequelize.BIGINT,
})

export const newGuildAC = async (user_id: string, guild_id: string) => {

  return await GuildActive.create({
    user_id,
    guild_id,
    messageAvg: 0,
    lastMessage: new Date().toISOString(),
    totalMessages: 1,
  })
}

export const findOrCreateGuildAC = async (user_id: string, guild_id: string) => {
  const gac = await GuildActive.findOne({ where: { user_id, guild_id } })

  if (!gac) {
    return newGuildAC(user_id, guild_id)
  }

  return gac
}
