import Command from "../classes/Command";
import average_audits from "./audits";
import log from "../helpers/log";
import { User } from "discord.js";

const audits = new Command('audits', msg => {
  const who = msg.content.match(/<@!(.+?)>/) || msg.content.match(/<@(.+?)>/)

  if (who)
    msg.guild.fetchAuditLogs({
      user: who[1],
      limit: 100,
    })
      .then(audits => msg.channel.send(average_audits(audits, who[1])))

  else msg.reply('Must @someone')
})

const debug = new Command('debug', (msg, ref) => {
  log(msg.content)
  msg.channel.send(`Arguments: ${ref.params}`)
})


const bans = new Command('bans', (msg, ref) => {
  msg.guild.fetchAuditLogs({
    limit: Number(ref.params[0]) || 5,
    type: 'MEMBER_BAN_ADD'
  })
    .then(audits => {
      const audits_filtered = audits.entries.array().map(audit => {
        if (audit.target instanceof User) {
          const executor = audit.executor.tag
          const executee = audit.target.tag
          const reason = audit.reason || 'undefined'

          return { executor, executee, reason }
        } else return {}
      })

      let text = ''
      audits_filtered.map((obj) => {
        text += `\`\`\`Executor: ${obj.executor}, \nVictim: ${obj.executee}, \nReason: ${obj.reason} \n\n\`\`\``
      })

      msg.channel.send(text || "No bans here :thonk:")
    })
})


const declarations = [
  audits,
  debug,
  bans
]

export default declarations


