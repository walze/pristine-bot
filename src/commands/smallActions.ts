import log from "../helpers/logger";
import { action } from "../types";

export default class SmallActions {

  public static mafs: action = (msg, params) => {
    msg.channel.send(eval(params.text))
  }

  public static debug: action = (msg, params) => {
    log('\nMESSAGE:', msg.content)
    log(params, '\n')

    const send: any = {}

    for (let param in params)
      if (param[0] != '_')
        send[param] = params[param]

    msg.channel.send(JSON.stringify(send))
  }

  public static image: action = async (msg, params) => {
    msg.delete()

    if (params.text.match(/http/))
      return msg.channel.send('', { file: params.text })
    else
      return msg.channel.send('Invalid request')
  }

  public static say: action = (msg, params) => {
    msg.delete()
    msg.channel.send(`${params.getAt(0).tag} ${params.text}`)
  }

  public static thonkwot: action = (msg) => {
    msg.delete()
    msg.channel.send('', { file: 'https://cdn.discordapp.com/emojis/409528321685061634.png' })
  }
}