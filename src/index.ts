process.setMaxListeners(0)

import './bot/commands/barrel'
import './database/commands/barrel'

import Request from './bot/classes/Request'
import { GoodOrBad } from './database/classes/Balance';
import client from './client';

client.on('message', (msg) => {
  if (msg.author.id === msg.client.user.id) return

  const req = new Request(msg)
  req.emit()

  const goodbad = new GoodOrBad(req)

  goodbad.emit()
})
