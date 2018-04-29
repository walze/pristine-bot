import * as Express from 'express'
import { Client } from 'discord.js'
import Commands from './classes/Commands';
import log from './helpers/log';


const app = Express()
app.listen(process.env.PORT || 3000, () => console.log('Express ready...'))
app.get('/', (req, res) => res.send(`Bot working, noice...`))

const client = new Client()
const config = require('../config.json')

client.login(config.token)
client.on('ready', () => log('Bot ready...'))




const commands = new Commands()

client.on('message', msg => commands.run(msg))

