import Sequelize from 'sequelize';
import { sql } from '../db';

export interface IGuildsModel {
  id: string;
}

export const Guild = sql.define<IGuildsModel, IGuildsModel>('guild', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
})

export const findOrCreateGuild = async (id: string) => {
  const guild = await Guild.findOne({ where: { id } })

  if (!guild) {
    return Guild.create({ id })
  }

  return guild
}
