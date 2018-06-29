const Sequelize = require('sequelize');
const sql = new Sequelize('testes', 'root', 'password', {
  host: '192.168.13.36',
  port: '3306',
  dialect: 'mysql',
});

const Iquery = sql.getQueryInterface()

Iquery.dropAllTables().then(() => {


  const User = sql.define('user', {
    id: {
      primaryKey: true,
      type: Sequelize.STRING
    },
    username: Sequelize.STRING,
    discriminator: Sequelize.STRING,
    balance: Sequelize.BIGINT
  });


  sql.sync()
    .then(() => {

      sql
        .query('SHOW tables;')
        .then(console.log);

    })

})
