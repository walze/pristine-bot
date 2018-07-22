import { log } from 'console';
import { RichEmbedOptions } from 'discord.js';
import Request from '../classes/Request';
import { mapObj } from './obj_array';

export default function ReplyError(req: Request, err: Error) {
  log(err)
  req.log(true)

  const embed: RichEmbedOptions = {
    title: "Error Information",
    description: err.message,
    fields: [
      {
        name: 'Command',
        value: req.command,
        inline: true,
      },
      {
        name: 'Text',
        value: req.text || '*empty*',
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

  return req.msg.reply(`sorry but I couldn't complete your request >///<\nBut you can try using *help* __${req.command}__ to know more about this command cx`, { embed })
}
