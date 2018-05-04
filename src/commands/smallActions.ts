import { DiscordAction } from "../classes/Command";
import log from "../helpers/logger";

export const mafs: DiscordAction = (msg, params) => {
  msg.channel.send(eval(params.text))
}

export const debug: DiscordAction = (msg, params) => {
  log('\nMESSAGE:', msg.content)
  log(params, '\n')

  const send: any = {}

  for (let param in params)
    if (param[0] != '_')
      send[param] = params[param]

  msg.channel.send(JSON.stringify(send))
}

export const image: DiscordAction = (msg, params) => {
  msg.delete()
  msg.channel.send('', { file: params.text })
}

export const say: DiscordAction = (msg, params) => {
  msg.delete()
  msg.channel.send(`${params.getAt(0).tag} ${params.text}`)
}

export const thonkwot: DiscordAction = (msg) => {
  msg.delete()
  msg.channel.send('', { file: 'https://cdn.discordapp.com/emojis/409528321685061634.png' })
}