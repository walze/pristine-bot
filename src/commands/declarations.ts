import Command from "../classes/Command";
import log from "../helpers/log";
import auditsHandler from "./averageAudits";


// s-debug argument-text
// Eg. s-debug event-MEMBER_ADD_BAN amount-5 @wiva#9996

const debug = new Command('debug', (msg, ref) => {
  log('MESSAGE:', msg.content)
  log(ref)

  msg.channel.send(`\`\`\`json\n${JSON.stringify(ref)} \`\`\``)
})

const audits = new Command('audits', (msg, ref) => auditsHandler(msg, ref))

const declarations = [
  debug,
  audits,
]

export default declarations
