//import log from "../../helpers/logger";
import { definition } from "../../types";

import * as wordnet from 'wordnet'
import { DiscordAction } from "../../classes/Command";

export const defineAction: DiscordAction = (msg, params) => {
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