import Command from "../classes/Command";
import average_audits from "./audits";
import log from "../helpers/log";
import auditBansFilter from "./auditBansFilter";


const audits = new Command('audits', msg => {
  const who = msg.content.match(/<@!?(.+?)>/)

  if (who)
    msg.guild.fetchAuditLogs({
      user: who[1],
      limit: 100,
    })
      .then(audits => msg.channel.send(average_audits(audits, who[1])))

  else msg.reply('Must @someone')
})


const debug = new Command('debug', (msg, ref) => {
  log('DEBUG MESSAGE:', msg.content)
  msg.channel.send(`Arguments: ${ref.params}`)
})


const bans = new Command('bans', (msg, ref) => {
  msg.guild.fetchAuditLogs({
    limit: Number(ref.params[0]) || 5,
    type: 'MEMBER_BAN_ADD'
  })
    .then(audits => auditBansFilter(audits, msg))
})

const auditfilters = new Command('auditfilters', (msg) => {
  let text = 'Filter Name | Filter Value\n\n';

  AuditLogEvents.map(el => text += `${el[0]}  |  ${el[1]}\n`)

  msg.channel.send(text)
})


const declarations = [
  audits,
  debug,
  bans,
  auditfilters,
]

export default declarations

const AuditLogEvents = [
  ['GUILD_UPDATE', 1],
  ['CHANNEL_CREATE', 10],
  ['CHANNEL_UPDATE', 11],
  ['CHANNEL_DELETE', 12],
  ['CHANNEL_OVERWRITE_CREATE', 13],
  ['CHANNEL_OVERWRITE_UPDATE', 14],
  ['CHANNEL_OVERWRITE_DELETE', 15],
  ['MEMBER_KICK', 20],
  ['MEMBER_PRUNE', 21],
  ['MEMBER_BAN_ADD', 22],
  ['MEMBER_BAN_REMOVE', 23],
  ['MEMBER_UPDATE', 24],
  ['MEMBER_ROLE_UPDATE', 25],
  ['ROLE_CREATE', 30],
  ['ROLE_UPDATE', 31],
  ['ROLE_DELETE', 32],
  ['INVITE_CREATE', 40],
  ['INVITE_UPDATE', 41],
  ['INVITE_DELETE', 42],
  ['WEBHOOK_CREATE', 50],
  ['WEBHOOK_UPDATE', 51],
  ['WEBHOOK_DELETE', 52],
  ['EMOJI_CREATE', 60],
  ['EMOJI_UPDATE', 61],
  ['EMOJI_DELETE', 62],
  ['MESSAGE_DELETE', 72]
]


