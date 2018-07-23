import { Client } from 'discord.js'
import Commands from './bot/classes/Commands'
import { log } from 'console'

const client = new Client()

import config from '../config.json'

console.log(config)

client.login(config.token)
client.on('ready', () => {
  client.user.setActivity('s-help')
  log('\nBot Ready\n')
})

Commands.log()

// Error Handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled_Rejection'.toUpperCase())

  promise.catch((...args: any[]) => console.trace('UNHANDLED >', ...args))
})

export default client
