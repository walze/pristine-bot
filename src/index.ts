process.setMaxListeners(0)

import { Client } from 'discord.js'
import log from './helpers/logger'
import Request from './classes/Request'
import Commands from './classes/Commands'
import './commands/barrel'

// import * as Express from 'express'
// const app = Express()
// app.listen(process.env.PORT || 3000, () => log('\nExpress Ready'))
// app.get('/', (req, res) => res.send(`Bot's up`))

const client = new Client()
const config = require('../config.json')

client.login(config.token)
client.on('ready', () => {
  client.user.setActivity('self-hatred | s-help')
  log('\nBot Ready\n')
})

Commands.log()

client.on('message', msg => new Request(msg))


// Error Handling
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled_Rejection'.toUpperCase())

  promise.catch((...args: any[]) => console.log(...args))
});
