import log from "../helpers/logger";
import { action } from "../types";
import { embed } from "../helpers/discordHelpers";

export default class SmallActions {

  public static mafs: action = req => {
    try {
      req.msg.channel.send(eval(req.params.text))
    } catch (e) {
      req.msg.channel.send(embed(e))
    }
  }

  public static debug: action = req => {
    log('\nMESSAGE:', req.msg.content, '\n')

    const logs = req.log()

    req.msg.channel.send(`\`\`\`json\n${JSON.stringify(logs)}\`\`\``)
  }

  public static image: action = async req => {
    req.msg.delete()

    if (req.params.text.match(/https?:\/\//))
      return req.msg.channel.send('', { file: req.params.text })
    else
      return req.msg.channel.send('Invalid request')
  }

  public static say: action = req => {
    req.msg.delete()
    req.msg.channel.send(`${req.params.getAt(0).tag} ${req.params.text}`)
  }

  public static thonkwot: action = req => {
    req.msg.delete()
    req.msg.channel.send('', { file: 'https://cdn.discordapp.com/emojis/409528321685061634.png' })
  }
}