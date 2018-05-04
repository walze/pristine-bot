//import log from "../../helpers/logger";
import { definition, action } from "../../types";
import * as wordnet from 'wordnet'

export const defineAction: action = (msg, params) => {
  wordnet.lookup(params.text, (err: any, defs: definition[]) => {

    if (!err) {
      const text = defs.map((def, i) =>
        `__**Definition #${i + 1}**__
${def.glossary}

`)

      msg.channel.send(text)
    } else
      msg.channel.send('404\'d')
  })
}