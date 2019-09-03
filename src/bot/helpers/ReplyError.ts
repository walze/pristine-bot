import { Message, RichEmbed } from 'discord.js';

/**
 * If any Errors occur, it replies to channel
 *
 * @export
 * @param {CommandRequest} req
 * @param {Error} err
 * @returns
 */
export default function ReplyError(req: Message, err: Error) {
  console.error(err)

  return req.channel.send(``, { embed: InternalErrorReply(err) })
}

/**
 *
 *
 * @param {Error} err
 * @returns
 */
function InternalErrorReply(err: Error) {
  return new RichEmbed({
    title: "Internal Error",
    description: err.message,
  })
}
