import { actionType } from "../../types"
import { Requirements } from '../../classes/Requirements'
import Act from '../../classes/Act'
import Commands from '../../classes/Commands'
import { mapObj } from '../../helpers/obj_array'


const requirements: Requirements = {
  text: false
}

const description = 'Shows all commands or details a specific command'

const action: actionType = async req => {
  let embed = {
    embed: {
      author: {
        name: req.msg.author.username,
        icon_url: req.msg.author.avatarURL
      },
      title: "Commands List",
      fields: Commands.declarations.map(cmd => {
        return {
          name: cmd.name,
          value: cmd.act.description
        }
      }),
      timestamp: new Date()
    }
  }

  if (req.text !== '') {
    const command = Commands.findCommand(req.text)

    const args = mapObj(command.act.required, (value, prop) => {
      if (prop === 'params')
        if (value.props.length > 0)
          return value.props
    }).filter((el: any) => el)[0]

    const requirements = mapObj(command.act.required, (value, prop) => {
      if (value && prop !== 'params')
        return prop

      if (prop === 'params' && value.obligatory === true)
        return 'arguments'
      else return false
    }).filter((el: string) => el).join(' | ')

    embed.embed.title = `${req.text} details`
    embed.embed.fields = [
      {
        name: 'Description',
        value: command.act.description
      },
      {
        name: 'Required',
        value: requirements || '*none*'
      },
      {
        name: 'Arguments',
        value: args ? args.join(' | ') : '*none*'
      }
    ]
  }

  return await req.msg.channel.send(embed)
}


const help = new Act(requirements, action, description)

export default help