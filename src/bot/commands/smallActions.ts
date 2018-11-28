import Action from '../classes/Action';
import Commands from '../classes/Commands';
import { mapObj } from '../helpers/obj_array';
import { RichEmbedOptions } from 'discord.js';
import Axios from 'axios';

const debug = new Action({},
  async req => {
    req.log(true)

    const embed: RichEmbedOptions = {
      title: "Debug Message",
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
          value: req.atsLength > 0 ? req.ats.map(at => at.tag).join(' | ') : '*none*',
          inline: true,
        },
        {
          name: 'Arguments',
          value: mapObj(req.params, (val, name) => `${name}-${val}`).join(' | ') || '*none*',
          inline: true,
        },
      ],
    }

    return await req.msg.channel.send(``, { embed })
  },
  'debug for dev~~s~~',
)

const image = new Action({},
  async req => {
    req.msg.delete()

    if (req.text!.match(/https?:\/\//))
      return req.msg.channel.send('', { file: req.text! })
    else
      return req.msg.channel.send('Invalid request')
  },
  'Posts an image from a link',
)

const say = new Action({},
  req => {
    req.msg.delete()
    return req.msg.channel.send(`${req.text}`)
  },
  'Bot says whatever you type',
)

const thonkwot = new Action({ text: false },
  req => {
    req.msg.delete()
    return req.msg.channel.send('', { file: 'https://cdn.discordapp.com/emojis/409528321685061634.png' })
  },
  ':thonkwot:',
)

const roast = new Action({ text: false },
  req => {
    const at = req.at(0)

    return Axios.get('https://insult.mattbas.org/api/insult/')
      .then(async res => {
        if (at)
          return await req.msg.channel.send(`${at.tag}, ${res.data}`)
        else
          return await req.msg.reply(res.data)
      })
  },
  ':roasts:',
)

Commands.add('debug', debug)
Commands.add('image', image)
Commands.add('say', say)
Commands.add('thonkwot', thonkwot)
Commands.add('roast', roast)
