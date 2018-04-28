import * as Express from 'express'
import * as log from 'better-log'
import { Client } from 'discord.js'
import Command from './classes/Command';
import Commands from './classes/Commands';
import average_audits from './commands/audits';


const app = Express()
app.listen(process.env.PORT || 3000, () => console.log('Express ready...'))
app.get('/', (req, res) => res.send(`Bot working, noice...`))

log.setConfig({ depth: 2 })


const client = new Client()
const config = require('../config.json')

client.login(config.token)
client.on('ready', () => log('Bot ready...'))





const commands = new Commands()

const audits = new Command('audits', msg => {
  const who = msg.content.match(/<@!(.+?)>/) || msg.content.match(/<@(.+?)>/)

  if (who)
    msg.guild.fetchAuditLogs({
      user: who[1],
      limit: 100
    })
      .then(audits => msg.channel.send(average_audits(audits, who[1])))

  else msg.reply('Must @someone')
})

commands.add([
  audits,

])

client.on('message', msg => commands.run(msg))

