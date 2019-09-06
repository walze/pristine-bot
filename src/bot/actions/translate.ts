import { createAction } from "."
import { Actions } from "./helpers/enum"
import { languages } from './helpers/languages'
import { mutateCommand, commandError } from '../command'

import translate from 'translate'

translate.engine = 'yandex'
translate.key = 'trnsl.1.1.20190903T191239Z.9d8aaecd43beaf97.af8b53416f3189c9a48a364b322dcca667e62648'

const switchText = (language: string = ''): string | undefined => {
  language = language.replace(/\b\w/g, l => l.toUpperCase())

  for (const lang in languages)
    if (languages[lang] === language)
      return languages[lang]

  return undefined
}

createAction(
  Actions.translate,
  'Translates given text to ~~almost~~ any language ~~precision not guaranteed~~',
  {
    from: false,
    to: true,
  },
  async command => {
    const { flags, content } = command
    if (!flags || !content) throw commandError(command, 'This command needs arguments')

    const text = await translate(
      content,
      {
        from: switchText(flags.from) || 'en',
        to: switchText(flags.to),
      },
    )

    return mutateCommand(command, { content: text })
  },
)
