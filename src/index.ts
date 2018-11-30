import { Message } from 'discord.js'
// tslint:disable-next-line:no-var-requires
require('source-map-support').install()
process.setMaxListeners(0)

import CommandRequest from './bot/classes/CommandRequest'
import WordsMod from './database/classes/WordsMod'
import client from './setup'

import ReplyError from './bot/helpers/ReplyError'
import Commands from './bot/classes/Commands'
import { MessageAverage } from './database/classes/MessageAverage'

const runTasks = (msg: Message) => {

  // returns if msg is from bot
  if (msg.author.id === msg.client.user.id) return

  // creates new request
  const request = new CommandRequest(msg)

  // Handles Request Errors
  try {

    if (request.command) {
      Commands.execute(request)
    }

    // creates wordsmod and emits it
    const mod = new WordsMod(request)
    mod.emit()

    // tslint:disable-next-line:no-unused-expression
    new MessageAverage(msg)

  } catch (err) {
    ReplyError(request, err)
  }
}

const onMessage = async (msg: Message) => {
  // Handles Internal Errors
  try {

    runTasks(msg)

  } catch (err) {
    ReplyError(msg, err)
  }
}

client.on('message', onMessage)
