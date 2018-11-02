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

Iquery.dropAllTables().then(() => {

  sql.sync().then(() => console.log(`\nDB synced`))

})
