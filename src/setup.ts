import { Client } from 'discord.js'
import Commands from './bot/classes/Commands'
import { log } from 'console'

const client = new Client()

import config from '../config.json'

client.login(config.token)
client.on('ready', () => {
  client.user.setActivity('s-help')

  Commands.log()

  log('\nBot Ready\n')
})

// Error Handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('!!!!! unhandle_rejection !!!!!'.toUpperCase())

  promise.catch((...args: any[]) => console.trace('UNHANDLED >', ...args))
})

export default client
