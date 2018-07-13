process.setMaxListeners(0)

import { Client } from 'discord.js'
import log from './bot/helpers/logger'
import Request from './bot/classes/Request'
import Commands from './bot/classes/Commands'
import './commands/barrel'

const client = new Client()

// tslint:disable-next-line:no-var-requires
const config = require('../config.json')

client.login(config.token)
client.on('ready', () => {
  client.user.setActivity('s-help')
  log('\nBot Ready\n')
})

Commands.log()

client.on('message', (msg) => {
  if (msg.author.id === msg.client.user.id) return

  const req = new Request(msg)
  req.emit()
})

// Error Handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled_Rejection'.toUpperCase())

  promise.catch((...args: any[]) => console.trace('UNHANDLED >', ...args))
});
