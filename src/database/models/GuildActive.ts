import Sequelize from 'sequelize';
import { sql } from '../db';

export interface IGuildActive {
  id?: number,
  guild_id: string;
  messageAvg: number;
  lastMessage: string;
  totalMessages: number;
}

export const GuildActive = sql.define<IGuildActive, IGuildActive>('guild_active', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  guild_id: {
    type: Sequelize.STRING,
    references: {
      model: 'guilds',
      key: 'id',
    },
  },
  messageAvg: Sequelize.FLOAT,
  lastMessage: Sequelize.DATE,
  totalMessages: Sequelize.BIGINT,
})

export const newGuildAC = async (guild_id: string) => {

  return await GuildActive.create({
    guild_id,
    messageAvg: 0,
    lastMessage: new Date().toISOString(),
    totalMessages: 1,
  })
}

export const findOrCreateGuildAC = async (guild_id: string) => {
  const gac = await GuildActive.findOne({ where: { guild_id } })

  if (!gac) {
    return newGuildAC(guild_id)
  }

  return gac
}
