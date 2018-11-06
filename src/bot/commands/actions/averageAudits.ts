import { GuildAuditLogs } from "discord.js";
import { actionBehaviour, Iat } from "../../../types";
import { Requirements } from '../../classes/Requirements';
import Action from '../../classes/Action';
import Commands from '../../classes/Commands';
import { date_diff } from '../../helpers/date_diff';

const requirements: Requirements = {
  ats: true,
  text: false,
}

const description = 'Shows average time between audits from a user'

const action: actionBehaviour = req => {
  const at = req.at(0)

  if (!at.id) throw new Error('Invalid ID')

  return req.msg.guild.fetchAuditLogs({
    user: at.id,
    limit: Number(req.params.amount) || 100,
  })
    .then(auditsResp =>
      req.msg.channel.send(
        calculateAverage(auditsResp, at),
      ),
    )
}

const audits = new Action(requirements, action, description)
Commands.add('audits', audits)

function calculateAverage(audit: GuildAuditLogs, at: Iat) {

  if (audit.entries.size <= 1)
    return 'Couldn\'t complete. Less than 2 audits found.'

  // getting audit creation time
  const audit_times = audit.entries.array().map(el => el.createdTimestamp);

  // if any audits
  const diffs = audit_times.map((current, i) => {

    const next = audit_times[i + 1];

    // next = older
    // current = newer
    // return time difference between current and next audit
    return date_diff(next, current)

    // remove last value 'undefined'
  }).splice(0, audit_times.length - 1)

  const average = diffs.reduce((prev, curr) => prev + curr, 0) / diffs.length

  const text = `
    ${at.tag}'s average is \n
    ${(average).toFixed(2)} Seconds
    ${(average / 60).toFixed(2)} Minutes
    ${(average / 60 / 60).toFixed(2)} Hours
    ${(average / 60 / 60 / 24).toFixed(2)} Days
    `;

  return text
}
