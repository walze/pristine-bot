//import log from "../../helpers/logger";
import { definition, action } from "../../types";
import * as wordnet from 'wordnet'

export const defineAction: action = req => {
  wordnet.lookup(req.text, (err: any, defs: definition[]) => {

    if (!err) {
      const embed = {
        embed: {
          author: {
            name: req.msg.author.username,
            icon_url: req.msg.author.avatarURL
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


      req.msg.channel.send(embed)
    } else
      req.msg.channel.send('404\'d')
  })
}