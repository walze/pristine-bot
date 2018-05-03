import Command from "../classes/Command";
import log from "../helpers/logger";
import auditsAction from "./actions/averageAudits";
import translatorAction from "./actions/translator";
import urbanAction from "./actions/urban";
import defineAction from "./actions/define";
import Commands from "../classes/Commands";

// s-debug argument-value
// Eg. s-debug event-MEMBER_ADD_BAN amount-5 @wiva#9996
// params.argument will equals to value

export const debug = new Command('debug', (msg, params) => {
  log('\nMESSAGE:', msg.content)
  log(params, '\n')

  const send: any = {}

  for (let param in params)
    if (param[0] != '_')
      send[param] = params[param]

  msg.channel.send(JSON.stringify(send))
})

export const say = new Command('say', (msg, params) => {
  msg.delete()
  msg.channel.send(`${params.getAt(0).tag} ${params.text}`)
})

export const thonkwot = new Command('thonkwot', msg => {
  msg.delete()
  msg.channel.send('', { file: 'https://cdn.discordapp.com/emojis/409528321685061634.png' })
})

export const image = new Command('image', (msg, params) => {
  msg.delete()
  msg.channel.send('', { file: params.text })
})

export const help = new Command('help', msg => msg.channel.send(Commands.list()))
export const audits = new Command('audits', auditsAction)
export const tl = new Command('tl', translatorAction)
export const urban = new Command('urban', urbanAction)
export const define = new Command('define', defineAction)