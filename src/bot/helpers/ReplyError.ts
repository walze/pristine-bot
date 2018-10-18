import { trace } from 'console';
import { Message, RichEmbed } from 'discord.js';
import CommandRequest from '../classes/Request';
import { mapObj } from './obj_array';
import Commands from '../classes/Commands';

/**
 * If any Errors occur, it replies to channel
 *
 */
export const ReplyError = (req: CommandRequest | Message, err: Error) => {
  trace(err)

  if (req instanceof Message) {
    return req.channel.send(``, { embed: InternalErrorReply(err) })
  }

  req.log(true)

  return req.msg.channel.send(
    ``,
    { embed: RequestErrorReply(req, err) },
  )
}

export default ReplyError

const InternalErrorReply = (err: Error) =>
  new RichEmbed({
    title: "Internal Error",
    description: err.message,
  })

const RequestErrorReply = (req: CommandRequest, err: Error) => {
  const description = `${err.message}. Try using **${Commands.prefix}help ${req.command}** cx'`

  return new RichEmbed({
    title: "Request Error Information",
    description,
    author: {
      name: req.msg.author.username,
      icon_url: req.msg.author.avatarURL,
    },
    fields: [
      {
        name: 'Command',
        value: req.command,
        inline: true,
      },
      {
        name: 'Text',
        value: req.text || '*none*',
        inline: true,
      },
      {
        name: '@\'s',
        value: req.ats.length > 0 ? req.ats.map(at => at.tag).join(' | ') : '*none*',
        inline: true,
      },
      {
        name: 'Arguments',
        value: mapObj(req.params, (val, name) => `${name}-${val}`).join(' | ') || '*none*',
        inline: true,
      },
    ],
  })
}
