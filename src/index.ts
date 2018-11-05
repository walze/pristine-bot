// tslint:disable-next-line:no-var-requires
require('source-map-support').install();
process.setMaxListeners(0)

import CommandRequest from './bot/classes/CommandRequest'
// import WordsMod from './database/classes/Balance'
import client from './setup'
import Performances from './bot/classes/Performances'

import './bot/commands/barrel'
import ReplyError from './bot/helpers/ReplyError'
import { Message } from 'discord.js'
import Commands from './bot/classes/Commands';

const runTasks = async (msg: Message) => {

  // returns if msg is from bot
  if (msg.author.id === msg.client.user.id) return 0

  // starts performance test
  Performances.start('request')

  // creates new request
  const req = new CommandRequest(msg)

  // Handles Request Errors
  try {

    let t1 = 0
    let t2 = 0
    let t3 = 0

    // if there is a command
    if (req.command) {
      console.log('\n')

      // ends request p-test
      t1 = Performances.end('request')

      Performances.start('command')

      // Executes command
      await Commands.execute(req)

      // ends command p-test after run
      t2 = Performances.end('command')
    }

    Performances.start('wordsmod')

    // creates wordsmod and emits it
    // const mod = new WordsMod(req)
    // mod.emit()

    if (req.command)
      t3 = Performances.end('wordsmod')

    return [t1, t2, t3].reduce((prev, curr) => prev + curr)
  } catch (err) {
    ReplyError(req, err)
    return 0
  }
}

export const onMessage = async (msg: Message) => {
  // Handles Internal Errors
  try {

    // starts performance test for everything
    Performances.start('all');

    const times = await runTasks(msg);

    if (!times || times < 1)
      return;

    // ends p-test of all but gets time only
    const t3 = Performances.end('all', false);

    console.log(`|| everything ran in ${times + t3} ms \n`);
  } catch (err) {
    ReplyError(msg, err);
  }
}

client.on('message', onMessage)
