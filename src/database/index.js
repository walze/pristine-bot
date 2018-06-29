const Sequelize = require('sequelize');
const sql = new Sequelize('testes', 'root', 'password', {
  host: '192.168.13.36',
  port: '3306',
  dialect: 'mysql',
});

const Iquery = sql.getQueryInterface()

//  Iquery.dropAllTables()

const User = sql.define('user', {
  id: Sequelize.STRING,
  username: Sequelize.STRING,
  discriminator: Sequelize.STRING,
});


sql.sync()
  .then(() => {

    sql
      .query('SHOW COLUMNS FROM users;')
      .then(console.log);

  })