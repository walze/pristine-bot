import Action from '../classes/Action';
import Commands from '../classes/Commands';
import { mapObj } from '../helpers/obj_array';
import { RichEmbedOptions } from 'discord.js';

const debug = new Action({},
  async req => {
    req.log(true)

    const embed: RichEmbedOptions = {
      title: "Debug Message",
      fields: [
        {
          name: 'Command',
          value: req.command,
          inline: true
        },
        {
          name: 'Text',
          value: req.text || '*empty*',
          inline: true
        },
        {
          name: '@\'s',
          value: req.ats.length > 0 ? req.ats.map(at => at.tag).join(' | ') : '*none*',
          inline: true
        },
        {
          name: 'Arguments',
          value: mapObj(req.params, (val, name) => `${name}-${val}`).join(' | ') || '*none*',
          inline: true
        },
        {
          name: 'Request',
          value: `\`\`\`json\n${JSON.stringify(req.log())}\`\`\``
        }
      ]
    }

    return await req.msg.channel.send(``, { embed })
  },
  'debug for dev~~s~~'
)

const image = new Action({},
  async req => {
    req.msg.delete()

    if (req.text.match(/https?:\/\//))
      return req.msg.channel.send('', { file: req.text })
    else
      return req.msg.channel.send('Invalid request')
  },
  'Posts an image from a link'
)

const say = new Action({},
  req => {
    req.msg.delete()
    return req.msg.channel.send(`${req.text}`)
  },
  'Bot says whatever you type'
)

const thonkwot = new Action({ text: false },
  req => {
    req.msg.delete()
    return req.msg.channel.send('', { file: 'https://cdn.discordapp.com/emojis/409528321685061634.png' })
  },
  ':thonkwot:'
)

Commands.add('debug', debug)
Commands.add('image', image)
Commands.add('say', say)
Commands.add('thonkwot', thonkwot)