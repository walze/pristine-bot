import * as Express from 'express'
import { Client } from 'discord.js'
import Commands from './classes/Commands';
import log from './helpers/log';


const app = Express()
app.listen(process.env.PORT || 3000, () => log('Express Ready'))
app.get('/', (req, res) => res.send(`Bot working...`))

const client = new Client()
const config = require('../config.json')

client.login(config.token)
client.on('ready', () => log('Bot Ready'))


const commands = new Commands()
client.on('message', msg => commands.run(msg))

