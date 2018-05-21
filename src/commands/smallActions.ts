import log from "../helpers/logger";
import Action from '../classes/Act';

export default class SmallActions {

  public static debug: Action = new Action({},
    req => {
      log('\nMESSAGE:', req.msg.content, '\n')

      req.log(true)

      throw new Error('Debug message')
    },
    'debug for dev~~s~~'
  )

  public static image: Action = new Action({},
    async req => {
      req.msg.delete()

      if (req.text.match(/https?:\/\//))
        return req.msg.channel.send('', { file: req.text })
      else
        return req.msg.channel.send('Invalid request')
    },
    'Posts an image from a link'
  )

  public static say: Action = new Action({},
    req => {
      req.msg.delete()
      req.msg.channel.send(`${req.getAt(0).tag} ${req.text}`)
    },
    'Bot says whatever you type'
  )

  public static thonkwot: Action = new Action({ text: false },
    req => {
      req.msg.delete()
      req.msg.channel.send('', { file: 'https://cdn.discordapp.com/emojis/409528321685061634.png' })
    },
    ':thonkwot:'
  )
}