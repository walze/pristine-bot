import log from '../../helpers/logger'
import { Languages } from './helpers/langs'
import * as translate from 'google-translate-api'
import { actionType } from '../../types';
import { Requirements } from '../../classes/Requirements';
import Act from '../../classes/Act';

const requirements: Requirements = {
  text: true,
  params: {
    from: false,
    to: false
  }
}

const description = 'Translates given text to ~~almost~~ any language ~~precision not guaranteed~~'

const action: actionType = request => {
  return translate(request.text, {
    from: switchText(request.params.from) || 'auto',
    to: switchText(request.params.to) || 'en'
  })
    .then((res: Response) => {
      request.msg.channel.send(`${res.text}`)
      return res
    })
    .catch((err: Response) => {
      log(err)
      request.msg.channel.send(`Error: ${JSON.stringify(err)}`)
      return err
    })
}

const translator = new Act(requirements, action, description)
export default translator

function switchText(language: string = ''): string | void {
  language = language.replace(/\b\w/g, l => l.toUpperCase())

  for (let lang in Languages)
    if (Languages[lang] === language)
      return Languages[lang]
}