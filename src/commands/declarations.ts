import Command from "../classes/Command";
import log from "../helpers/logger";
import auditsHandler from "./actions/averageAudits";
import translator from "./actions/translator";

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

const audits = new Command('audits', auditsHandler)
const tl = new Command('tl', translator)

const declarations = [
  debug,
  audits,
  tl,
  thonk,
  say
]

export default declarations
