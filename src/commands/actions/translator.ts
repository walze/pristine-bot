import { Message } from 'discord.js'
import log from '../../helpers/logger'
import { Languages } from './langs'
import * as translate from 'google-translate-api'
import Parameters from '../../classes/Parameters';

export default function translatorAction(msg: Message, params: Parameters) {
  translate(params.text, {
    from: switchText(params.from) || 'auto',
    to: switchText(params.to) || 'en'
  })
    .then((res: Response) => {
      msg.channel.send(`${res.text}`)
    })
    .catch((err: Response) => {
      log(err)
      msg.channel.send(`Error: ${JSON.stringify(err)}`)
    })
}

function switchText(language: string = ''): string | void {
  language = language.replace(/\b\w/g, l => l.toUpperCase())

  for (let lang in Languages)
    if (Languages[lang] === language)
      return Languages[lang]
}