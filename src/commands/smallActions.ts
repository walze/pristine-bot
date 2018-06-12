import log from "../helpers/logger";
import Action from '../classes/Act';
import Commands from '../classes/Commands';

const debug: Action = new Action({},
  req => {
    log('\nMESSAGE:', req.msg.content, '\n')

    req.log(true)

    throw new Error('Debug message')
  },
  'debug for dev~~s~~'
)

const image: Action = new Action({},
  async req => {
    req.msg.delete()

    if (req.text.match(/https?:\/\//))
      return req.msg.channel.send('', { file: req.text })
    else
      return req.msg.channel.send('Invalid request')
  },
  'Posts an image from a link'
)

const say: Action = new Action({},
  req => {
    req.msg.delete()
    req.msg.channel.send(`${req.text}`)
  },
  'Bot says whatever you type'
)

const thonkwot: Action = new Action({ text: false },
  req => {
    req.msg.delete()
    req.msg.channel.send('', { file: 'https://cdn.discordapp.com/emojis/409528321685061634.png' })
  },
  ':thonkwot:'
)

Commands.add('debug', debug)
Commands.add('image', image)
Commands.add('say', say)
Commands.add('thonkwot', thonkwot)