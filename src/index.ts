import * as Express from 'express'
import * as log from 'better-log'
import { Client, Message } from 'discord.js'


const app = Express()
app.listen(process.env.PORT || 3000, () => console.log('Express ready...'))
app.get('/', (req, res) => res.send(`Bot working, noice...`))


log.setConfig({ depth: 3 })


const client = new Client()

const config = require('../config.json')

client.login(config.token)
client.on('ready', () => log('Bot ready...'))

// function commands(msg: Message) {
//   if (msg.content == 'ping')
//     msg.reply('u mom gay')
// }


class Command {
  public name: string
  public action: Function

  constructor(name: string, action: Function) {
    this.name = name
    this.action = function (message: Message) {
      return action(message)
    }
  }

  public run(message: Message) {
    return this.action(message)
  }
}

const ping = new Command('ping', (msg: Message) => msg.reply('nice'))

log(ping)

client.on('message', ping.run)

