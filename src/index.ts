import * as Express from 'express'
import { Client } from 'discord.js'
import Commands from './classes/Commands'
import log from './helpers/log'
process.setMaxListeners(0)


const app = Express()
app.listen(process.env.PORT || 3000, () => log('\nExpress Ready'))
app.get('/', (req, res) => res.send(`Bot is up`))


const client = new Client()
const config = require('../config.json')

client.login(config.token)
client.on('ready', () => {
  // Academic Server
  // listRoles(client, "354432374274260995")

  log('\nBot Ready\n')  
})

const commands = new Commands

client.on('message', msg => commands.run(msg))



