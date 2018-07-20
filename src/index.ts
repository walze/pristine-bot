process.setMaxListeners(0)

import Request from './bot/classes/Request'
import './bot/commands/barrel'
import { GoodOrBad } from './database/classes/Balance';
import client from './client';

client.on('message', (msg) => {
  if (msg.author.id === msg.client.user.id) return

  const req = new Request(msg)
  // req.log(true)
  // req.emit()

  const goodbad = new GoodOrBad(req)
  console.log(goodbad)

  goodbad.emit()
})
