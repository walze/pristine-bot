//import log from "../../helpers/logger";
import { actionType } from "../../types";
import { Requirements } from '../../classes/Requirements';
import Act from '../../classes/Act';


const requirements: Requirements = {
  text: false
}

const description = 'Show all commands or show in detail a specific command'

const action: actionType = async req => {

  const embed = {
    embed: {
      author: {
        name: req.msg.author.username,
        icon_url: req.msg.author.avatarURL
      },
      title: "Help",
      fields: [],
      timestamp: new Date()
    }
  }

  return await req.msg.channel.send(embed)
}


const help = new Act(requirements, action, description)

export default help