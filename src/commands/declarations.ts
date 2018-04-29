import Command from "../classes/Command";
import average_audits from "./audits";
import log from "../helpers/log";

const audits = new Command('audits', msg => {
  const who = msg.content.match(/<@!(.+?)>/) || msg.content.match(/<@(.+?)>/)

  if (who)
    msg.guild.fetchAuditLogs({
      user: who[1],
      limit: 100
    })
      .then(audits => msg.channel.send(average_audits(audits, who[1])))

  else msg.reply('Must @someone')
})

const debug = new Command('debug', msg => {
  log(msg.content)
})


const declarations = [
  audits,
  debug
]

export default declarations


