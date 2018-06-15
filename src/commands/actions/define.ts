//import log from "../../helpers/logger";
import { definitionResponse, actionFunction } from "../../types";
import * as wordnet from 'wordnet'
import { Requirements } from '../../classes/Requirements';
import Action from '../../classes/Action';
import Commands from '../../classes/Commands';

const requirements: Requirements = {
}

const description = 'Shows the definition of a word ~~or not~~'

const action: actionFunction = async req => {

  return await new Promise((resolve, rej) => {

    wordnet.lookup(req.text, async (err: any, defs: definitionResponse[]) => {

      if (err) return rej(new Error('404\'d'))

      const embed = {
        embed: {
          author: {
            name: req.msg.author.username,
            icon_url: req.msg.author.avatarURL
          },
          title: "Definitions of " + req.text,
          fields: defs.map((def, i) => {
            return {
              name: `Definition #${i + 1}`,
              value: def.glossary
            }
          }),
          timestamp: new Date()
        }
      }

      resolve(await req.msg.channel.send(embed))
    })
  })

}

const def = new Action(requirements, action, description)
Commands.add('define', def)