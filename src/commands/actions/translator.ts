import { Message } from 'discord.js'
import Command from '../../classes/Command'
import log from '../../helpers/log'
import { Languages } from './langs'
import * as translate from 'google-translate-api'

export default function translator(msg: Message, ref: Command) {
  translate(ref.params.text, {
    from: switchText(ref.params.from) || 'auto',
    to: switchText(ref.params.to) || 'en'
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