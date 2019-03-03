import Sequelize, { Options } from 'sequelize';
import { database, username, password, host } from '../../env.json'

const options: Options = {
  username,
  database,
  password,
  host,
  dialect: 'mysql',
  logging: false,
}

export const sql = new Sequelize(options)
export const Iquery = sql.getQueryInterface()

import './sync'
