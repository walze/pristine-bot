//import log from "../../helpers/logger";
import { definition, action } from "../../types";
import * as wordnet from 'wordnet'

export const defineAction: action = (msg, params) => {
  wordnet.lookup(params.text, (err: any, defs: definition[]) => {

    if (!err) {
      const embed = {
        embed: {
          author: {
            name: msg.author.username,
            icon_url: msg.author.avatarURL
          },
          title: "Definitions",
          fields: defs.map((def, i) => {
            return {
              name: `Definition #${i + 1}`,
              value: def.glossary
            }
          }),
          timestamp: new Date()
        }
      }


      msg.channel.send(embed)
    } else
      msg.channel.send('404\'d')
  })
}