import * as Express from 'express'
import { Client } from 'discord.js'
import Commands from './classes/Commands';
import log from './helpers/log';
import Command from './classes/Command';


const app = Express()
app.listen(process.env.PORT || 3000, () => log('Express Ready'))
app.get('/', (req, res) => res.send(`Bot working...`))

const client = new Client()
const config = require('../config.json')

process.setMaxListeners(0)

client.login(config.token)
client.on('ready', () => {
  log('Bot Ready')


  const server = client.guilds.get("354432374274260995")

  if (server) {
    const roles = server.roles
      .sort((roleA, roleB) => roleB.position - roleA.position)
      .map(role => {
        return {
          id: role.id,
          name: role.name,
          pos: role.position
        }
      })

    log(roles)
  }

  log('done')
})


const commands = new Commands()

client.on('message', msg => commands.run(msg))
