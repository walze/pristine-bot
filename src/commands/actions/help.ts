//import log from "../../helpers/logger";
import { actionType } from "../../types";
import { Requirements } from '../../classes/Requirements';
import Act from '../../classes/Act';
import Declarations from '../declarations';


const requirements: Requirements = {
  text: false
}

const description = 'Shows all commands or details a specific command'

const action: actionType = async req => {

  const embed = {
    embed: {
      author: {
        name: req.msg.author.username,
        icon_url: req.msg.author.avatarURL
      },
      title: "Commands List",
      fields: Declarations.map(cmd => {
        return {
          name: cmd.name,
          value: cmd.act.description
        }
      }),
      timestamp: new Date()
    }
  }

  return await req.msg.channel.send(embed)
}


const help = new Act(requirements, action, description)

export default help