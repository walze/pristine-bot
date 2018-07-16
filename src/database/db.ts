import Sequelize, { Options } from 'sequelize';

const options: Options = {
  database: 'testes',
  username: 'root',
  password: 'password',
  host: '192.168.13.36',
  port: 3306,
}

export const sql = new Sequelize(options)

export const Iquery = sql.getQueryInterface()

export const User = sql.define('user', {
  id: {
    primaryKey: true,
    type: Sequelize.STRING,
  },
  username: Sequelize.STRING,
  discriminator: Sequelize.STRING,
  balance: Sequelize.BIGINT,
})

Iquery.dropAllTables()
  .then(() => sql.sync())
