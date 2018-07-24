process.setMaxListeners(0)

import CommandRequest from './bot/classes/Request'
import WordsMod from './database/classes/Balance'
import client from './setup'
import Performances from './bot/classes/Performances'

import './bot/commands/barrel'
import ReplyError from './bot/helpers/ReplyError';
import { Message } from 'discord.js';

client.on('message', msg => {
  try {
    onMessage(msg)
  } catch (err) {
    ReplyError(msg, err)
  }
})

function onMessage(msg: Message) {
  // starts performance test for everything
  Performances.start('all')

  // returns if msg is from bot
  if (msg.author.id === msg.client.user.id) return

  // starts performance test for request and command
  Performances.start('request')
  Performances.start('command')

  // creates new request
  const req = new CommandRequest(msg)

  try {

    // if there is a command
    if (req.command) {
      // ends request p-test
      Performances.find('request').end()

      console.log(`|| emiting "${req.command}" request...`)

      // emits request and runs command
      req.emit()

      // ends command p-test after run
      Performances.find('command').end()
    }

    // creates wordsmod and emits it
    const mod = new WordsMod(req)
    mod.emit()

    // ends p-test of all
    if (req.command)
      Performances.find('all').end(2)

  } catch (err) {
    ReplyError(req, err)
  }
}
