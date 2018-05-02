import Command from "../classes/Command";
import log from "../helpers/logger";
import auditsAction from "./actions/averageAudits";
import translatorAction from "./actions/translator";
import { urban } from "../types";
import urbanAction from "./actions/urban";

// s-debug argument-text
// Eg. s-debug event-MEMBER_ADD_BAN amount-5 @wiva#9996

const debug = new Command('debug', (msg, params) => {
  log('\nMESSAGE:', msg.content)
  log(params, '\n')

  const send: any = {}

  for (let param in params)
    if (param[0] != '_')
      send[param] = params[param]

  msg.channel.send(JSON.stringify(send))
})

const say = new Command('say', (msg, params) => {
  msg.delete()
  msg.channel.send(`${params.getAt(0).tag} ${params.text}`)
})

const thonk = new Command('thonk', msg => {
  msg.delete()
  msg.channel.send('', { file: 'https://cdn.discordapp.com/emojis/409528321685061634.png' })
})

const audits = new Command('audits', auditsAction)
const tl = new Command('tl', translatorAction)
const urban = new Command('urban', urbanAction)

const declarations = [
  debug,
  audits,
  tl,
  thonk,
  say,
  urban,
]

export default declarations
