// tslint:disable-next-line:no-var-requires
require('source-map-support').install()

import './bot/actions/helpers/importActions'

import { Message } from 'discord.js'
import ReplyError from './bot/helpers/ReplyError'

import { client } from './setup'
import { parseCommand } from './bot/parse'

import { pipe } from 'ramda'
import { replyMessage } from './bot/reply'
import { makeCommand, ICommand } from './bot/command'
import { runAction, validadeAction } from './bot/actions/actions'

const runPipeline = async (message: Message) => {
  if (message.author.bot) return

  const command = makeCommand({ message })
  const run = pipe(
    parseCommand,
    validadeAction,
    runAction,
    replyMessage,
  )

  const ran = await run(command)
  const { message: _, ...obj } = ran
  console.log(obj)

  return ran
}

const onMessage = async (message: Message) => {
  // Handles Internal Errors
  try {
    await runPipeline(message)
  } catch (err) {
    ReplyError(err as ICommand)
  }
}

client.on('message', onMessage)
