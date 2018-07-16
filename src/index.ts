process.setMaxListeners(0)

import { Client } from 'discord.js'
import log from './bot/helpers/logger'
import Request from './bot/classes/Request'
import Commands from './bot/classes/Commands'
import './bot/commands/barrel'
import { GoodOrBad } from './database/classes/Balance';

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
  req.log(true)
  req.emit()

  const goodbad = new GoodOrBad(msg.content)
  // console.log(goodbad)

  if (!req.command)
    goodbad.emit(msg)
})

// Error Handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled_Rejection'.toUpperCase())

  promise.catch((...args: any[]) => console.trace('UNHANDLED >', ...args))
});
