import * as Express from 'express'
import { Client } from 'discord.js'
import Commands from './classes/Commands'
import log from './helpers/logger'
process.setMaxListeners(0)

const app = Express()
app.listen(process.env.PORT || 3000, () => log('\nExpress Ready'))
app.get('/', (req, res) => res.send(`Bot's up`))

const client = new Client()
const config = require('../config.json')

client.login(config.token)
client.on('ready', () => log('Bot Ready\n'))

log('\nListening to Commands\n', Commands.list())
client.on('message', msg => Commands.run(msg))