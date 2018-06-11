//import log from "../../helpers/logger";
import { definitionResponse, actionFunction } from "../../types";
import * as wordnet from 'wordnet'
import { Requirements } from '../../classes/Requirements';
import Action from '../../classes/Act';
import Commands from '../../classes/Commands';

const requirements: Requirements = {
}

const description = 'Shows the definition of a word ~~or not~~'

const action: actionFunction = async req => {
  return await wordnet.lookup(req.text, async (err: any, defs: definitionResponse[]) => {

    if (err)
      return await req.msg.channel.send('\`\`404\'d\`\`')

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

    return await req.msg.channel.send(embed)
  })
}

export const def = new Action(requirements, action, description)
Commands.add('define', def)