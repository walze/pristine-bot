import Command from "../classes/Command";
import log from "../helpers/logger";
import auditsHandler from "./actions/averageAudits";
import translator from "./actions/translator";

// s-debug argument-text
// Eg. s-debug event-MEMBER_ADD_BAN amount-5 @wiva#9996

const debug = new Command('debug', (msg, ref) => {
  log('MESSAGE:', msg.content)
  log(ref)
})

const audits = new Command('audits', auditsHandler)
const tl = new Command('tl', translator)
const love = new Command('love', msg => msg.channel.send(':heart:'))
const thonk = new Command('thonk', msg => msg.channel.send('', { file: 'https://cdn.discordapp.com/emojis/409528321685061634.png' }))

const declarations = [
  debug,
  audits,
  tl,
  love,
  thonk
]

export default declarations
