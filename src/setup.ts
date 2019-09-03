import { Client } from 'discord.js'
import { log } from 'console'

import { token } from '../env.json'

export const client = new Client()

client.login(token)

// Restart
client.on('error', () => client.login(token))
client.on('disconnect', () => client.login(token))

client.on('ready', () => {
  client.user.setActivity('s-help')

  log('Bot Ready\n')
})

// Error Handling
process.on('unhandledRejection', (_, promise) => {
  console.error('!!!!! unhandle_rejection !!!!!'.toUpperCase())

  promise.catch(console.error)
})
