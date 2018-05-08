process.setMaxListeners(0)

import * as Express from 'express'
import { Client } from 'discord.js'
import log from './helpers/logger'
import CommandRequest from './classes/CommandRequest';
import { logDeclarations } from './commands/declarations';

const app = Express()
app.listen(process.env.PORT || 3000, () => log('\nExpress Ready'))
app.get('/', (req, res) => res.send(`Bot's up`))

const client = new Client()
const config = require('../config.json')

client.login(config.token)
client.on('ready', () => log('Bot Ready\n'))

logDeclarations()

client.on('message', msg => new CommandRequest(msg))


// Error Handling
const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, p) => {
  unhandledRejections.set(p, reason);
  log(reason, p)
});