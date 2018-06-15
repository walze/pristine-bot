import { actionFunction } from "../../types"
import { Requirements } from '../../classes/Requirements'
import Action from '../../classes/Action'
import Commands from '../../classes/Commands'
import { mapObj } from '../../helpers/obj_array'


const requirements: Requirements = {
  text: false
}

const description = 'Shows all commands or details a specific command'

const action: actionFunction = async req => {
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
          value: cmd.action.description
        }
      }),
      timestamp: new Date()
    }
  }

  if (req.text !== '') {
    const command = Commands.find(req.text)

    const args = mapObj(command.action.required, (value, prop) => {
      if (prop === 'params')
        return mapObj(value, (required, arg) =>
          `${arg} | ${required ? '*needed*' : '*optional*'}\n`
        ).join('')
    }).join('')

    const requirements = mapObj(command.action.required, (value, prop) => {
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
        value: command.action.description
      },
      {
        name: 'Required',
        value: requirements || '*none*'
      },
      {
        name: 'Arguments',
        value: args || '*none*'
      }
    ]
  }

  await req.msg.channel.send(embed)
  return await req.msg.channel.send('Example: ``s-COMMAND TEXT @AT ARGUMENT-VALUE ``')
}


const help = new Action(requirements, action, description)

Commands.add('help', help)