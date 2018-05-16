process.setMaxListeners(0)

import * as Express from 'express'
import { Client } from 'discord.js'
import log from './helpers/logger'
import Request from './classes/Request';
import './commands/declarations'
import Commands from './classes/Commands';

const app = Express()
app.listen(process.env.PORT || 3000, () => log('\nExpress Ready'))
app.get('/', (req, res) => res.send(`Bot's up`))

const client = new Client()
const config = require('../config.json')

client.login(config.token)
client.on('ready', () => {
  client.user.setActivity('self-hatred | s-help')
  log('Bot Ready\n')
})

Commands.log()

client.on('message', msg => new Request(msg))


// Error Handling
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled_Rejection'.toUpperCase())

  promise.catch((...args: any[]) => console.log(...args))
});
