import * as Express from 'express'
import * as log from 'better-log'
import { Client } from 'discord.js'
import Command from './classes/Command';


const app = Express()
app.listen(process.env.PORT || 3000, () => console.log('Express ready...'))
app.get('/', (req, res) => res.send(`Bot working, noice...`))

log.setConfig({ depth: 2 })



const client = new Client()
const config = require('../config.json')

client.login(config.token)
client.on('ready', () => log('Bot ready...'))



const ping = new Command('ping', msg => {
  log(msg.author.username, msg.content)
})


client.on('message', msg => ping.run(msg))

