// tslint:disable-next-line:no-var-requires
require('source-map-support').install()

import { Message } from 'discord.js'
import ReplyError from './bot/helpers/ReplyError';

import { client } from './setup';
import { parseCommand } from './bot/parse';

import { pipe } from 'ramda'
import { replyMessage } from './bot/reply';
import { newCommand } from './bot/newCommand';

const runTasks = (message: Message) => {
  // returns if msg is from bot
  if (message.author.bot) return

  const command = newCommand({ message })
  const piped = pipe(
    parseCommand,
    replyMessage,
  )

  console.log(piped(command))
}

const onMessage = async (message: Message) => {
  // Handles Internal Errors
  try {
    runTasks(message)
  } catch (err) {
    ReplyError(message, err)
  }
}

client.on('message', onMessage)
