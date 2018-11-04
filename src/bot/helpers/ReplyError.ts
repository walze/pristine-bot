import { Message, RichEmbed, RichEmbedOptions } from 'discord.js';
import CommandRequest from '../classes/CommandRequest';
import { mapObj } from './obj_array';
import Commands from '../classes/Commands';

/**
 * If any Errors occur, it replies to channel
 *
 * @export
 * @param {CommandRequest} req
 * @param {Error} err
 * @returns
 */
export default function ReplyError(req: CommandRequest | Message, err: Error) {
  console.error(err)

  if (req instanceof Message) {
    return req.channel.send(``, { embed: InternalErrorReply(err) })
  }

  req.log(true)

  return req.msg.channel.send(``,
    { embed: RequestErrorReply(req, err) },
  )
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

/**
 *
 *
 * @param {CommandRequest} req
 * @param {Error} err
 * @returns
 */
function RequestErrorReply(req: CommandRequest, err: Error) {
  const description = `${err.message}. Try using **${Commands.prefix}help ${req.command}** cx'`

  const embed: RichEmbedOptions = {
    title: "Request Error Information",
    description,
    author: {
      name: req.msg.author.username,
      icon_url: req.msg.author.avatarURL,
    },
    fields: [
      {
        name: 'Command',
        value: req.command || '*none*',
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
  }

  return embed
}
