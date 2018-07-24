import Sequelize, { Options } from 'sequelize';

const options: Options = {
  database: 'test',
  username: 'root',
  password: '',
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  logging: false,
  operatorsAliases: false,
}

export const sql = new Sequelize(options)

export const Iquery = sql.getQueryInterface()

export const User = sql.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  goods: Sequelize.BIGINT,
  bads: Sequelize.BIGINT,
  username: Sequelize.STRING,
  discriminator: Sequelize.STRING,
  balance: Sequelize.BIGINT,
})

Iquery.dropAllTables().then(() => {

  sql.sync().then(() => console.log(`\nDB synced`))

})
