import { Message } from 'discord.js'
import ReplyError from './bot/helpers/ReplyError';

import { client } from './setup';
// tslint:disable-next-line:no-var-requires
require('source-map-support').install()

const runTasks = (msg: Message) => {
  // returns if msg is from bot
  if (msg.author.bot) return

  console.log(msg.content)
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
