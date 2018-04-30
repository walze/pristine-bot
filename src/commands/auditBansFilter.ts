import { GuildAuditLogs, Message, User } from "discord.js";

export default function auditBansFilter(audits: GuildAuditLogs, msg: Message) {
  const audits_filtered = audits.entries.array().map(audit => {
    if (audit.target instanceof User) {
      const executor = audit.executor.tag;
      const executee = audit.target.tag;
      const reason = audit.reason || 'undefined';
      return { executor, executee, reason };
    }
    else
      return {};
  });
  let text = '';
  audits_filtered.map((obj) => {
    text += `\`\`\`Executor: ${obj.executor}, \nVictim: ${obj.executee}, \nReason: ${obj.reason} \n\n\`\`\``;
  });
  msg.channel.send(text || "No bans here :thonk:");
}