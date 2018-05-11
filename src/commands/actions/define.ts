//import log from "../../helpers/logger";
import { definitionResponse, actionType } from "../../types";
import * as wordnet from 'wordnet'
import { Requirements } from '../../classes/Requirements';
import Act from '../../classes/Act';

const requirements: Requirements = {
}

const description = 'Shows the definition of a word ~~or not~~'

const action: actionType = async req => {
  return await wordnet.lookup(req.text, async (err: any, defs: definitionResponse[]) => {

    if (!err) {
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
    } else return await req.msg.channel.send('\`\`404\'d\`\`')
  })
}

const define = new Act(requirements, action, description)
export default define