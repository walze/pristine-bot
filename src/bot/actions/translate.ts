import translate from 'google-translate-api'

import { createAction } from "."
import { Actions } from "./helpers/enum"
import { languages } from './helpers/languages';
import { getCommand, changeCommand } from '../command';

const switchText = (language: string = ''): string | undefined => {
  language = language.replace(/\b\w/g, l => l.toUpperCase())

  for (const lang in languages)
    if (languages[lang] === language)
      return languages[lang]

  return undefined;
}

createAction(
  Actions.translate,
  'Translates given text to ~~almost~~ any language ~~precision not guaranteed~~',
  async (command) => {
    const { flags, content } = getCommand(command)
    if (!flags || !content) throw new Error('This command needs arguments');

    const text = await translate(
      content,
      {
        from: switchText(flags.get('from')) || 'auto',
        to: switchText(flags.get('to')),
      },
    )
      .then((res) => res.text)

    return changeCommand(command, { content: text })
  },
)
