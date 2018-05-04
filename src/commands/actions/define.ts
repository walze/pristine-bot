import { Message } from "discord.js";
//import log from "../../helpers/logger";
import Parameters from "../../classes/Parameters";
import { definition } from "../../types";

import * as wordnet from 'wordnet'

export default function defineAction(msg: Message, params: Parameters) {
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