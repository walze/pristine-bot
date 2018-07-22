process.setMaxListeners(0)

import './bot/commands/barrel'
import './database/commands/barrel'

import Request from './bot/classes/Request'
import GoodOrBad from './database/classes/Balance'
import client from './client'
import Performances from './bot/classes/Performances'

client.on('message', (msg) => {
  Performances.start('all')

  if (msg.author.id === msg.client.user.id) return

  Performances.start('request')
  Performances.start('command')

  const req = new Request(msg)

  if (req.command) {
    Performances.find('request').end()

    console.log(`|| emiting "${req.command}" request...`)
    req.emit()

    Performances.find('command').end()
  }

  const goodbad = new GoodOrBad(req)
  goodbad.emit()

  if (req.command)
    Performances.find('all').end(2)
})
