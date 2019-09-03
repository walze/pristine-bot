import { Message, RichEmbed } from 'discord.js';

/**
 * If any Errors occur, it replies to channel
 */
export default function ReplyError(message: Message, err: Error) {
  console.error(err)

  return message.channel.send(``, { embed: InternalErrorReply(err) })
}

function InternalErrorReply(err: Error) {
  return new RichEmbed({
    title: "Internal Error",
    description: err.message,
  })
}
