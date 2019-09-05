import { RichEmbed } from 'discord.js'
import { ICommand } from '../command'

/**
 * If any Errors occur, it replies to channel
 */
export default function ReplyError(command: ICommand) {
  if (!command.isCommand || !command.error) return
  const { error, message } = command

  return message.channel.send(``, { embed: InternalErrorReply(error) })
}

function InternalErrorReply(err: Error) {
  return new RichEmbed({
    title: "Internal Error",
    description: err.message,
  })
}
