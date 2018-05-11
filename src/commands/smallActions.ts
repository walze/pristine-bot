import log from "../helpers/logger";
import Act from '../classes/Act';

export default class SmallActions {

  public static debug: Act = new Act({},
    req => {
      log('\nMESSAGE:', req.msg.content, '\n')

      const logs = req.log()

      req.msg.channel.send(`\`\`\`json\n${JSON.stringify(logs)}\`\`\``)
    }
  )

  public static image: Act = new Act({},
    async req => {
      req.msg.delete()

      if (req.text.match(/https?:\/\//))
        return req.msg.channel.send('', { file: req.text })
      else
        return req.msg.channel.send('Invalid request')
    }
  )

  public static say: Act = new Act({},
    req => {
      req.msg.delete()
      req.msg.channel.send(`${req.getAt(0).tag} ${req.text}`)
    }
  )

  public static thonkwot: Act = new Act({},
    req => {
      req.msg.delete()
      req.msg.channel.send('', { file: 'https://cdn.discordapp.com/emojis/409528321685061634.png' })
    }
  )
}