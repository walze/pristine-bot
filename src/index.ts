process.setMaxListeners(0)

import CommandRequest from './bot/classes/Request'
import WordsMod from './database/classes/Balance'
import client from './setup'
import Performances from './bot/classes/Performances'

import './bot/commands/barrel'
import ReplyError from './bot/helpers/ReplyError'
import { Message } from 'discord.js'
import Commands from './bot/classes/Commands';

client.on('message', async msg => {

  // Handles Internal Errors
  try {
    // starts performance test for everything
    Performances.start('all')

    const times = await onMessage(msg)

    if (!times || times < 1) return

    // ends p-test of all but gets time only
    const t3 = Performances.find('all').end(false)

    console.log('|| everything ran in', times + t3, 'ms \n')
  } catch (err) {
    ReplyError(msg, err)
  }
})

async function onMessage(msg: Message) {

  // returns if msg is from bot
  if (msg.author.id === msg.client.user.id) return

  // starts performance test for request and command
  Performances.start('request')
  Performances.start('command')

  // creates new request
  const req = new CommandRequest(msg)

  // Handles Request Errors
  try {

    let t1 = 0
    let t2 = 0

    // if there is a command
    if (req.command) {
      console.log('\n')

      // ends request p-test
      t1 = Performances.find('request').end()

      // Executes command
      await Commands.execute(req)

      // ends command p-test after run
      t2 = Performances.find('command').end()
    }

    Performances.start('wordsmod')

    // creates wordsmod and emits it
    const mod = new WordsMod(req)
    mod.emit()

    let t3 = 0
    if (req.command)
      t3 = Performances.find('wordsmod').end()

    return [t1, t2, t3].reduce((prev, curr) => prev + curr)
  } catch (err) {
    ReplyError(req, err)
  }
}
