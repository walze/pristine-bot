import { actionBehaviour } from "../../../types"
import { Requirements } from '../../classes/Requirements'
import Action from '../../classes/Action'
import Commands from '../../classes/Commands'
import { mapObj } from '../../helpers/obj_array'
import { RichEmbedOptions } from 'discord.js';

const requirements: Requirements = {
  text: false,
}

const description = 'Shows all commands or details a specific command'

const action: actionBehaviour = async req => {
  const embed: RichEmbedOptions = {
    author: {
      name: req.msg.author.username,
      icon_url: req.msg.author.avatarURL,
    },
    title: "Commands List",
    fields: Commands.declarations.map(cmd => {
      return {
        name: cmd.name,
        value: cmd.description,
        inline: true,
      }
    }),
    timestamp: new Date(),
  }

  if (req.text !== '') {
    const command = Commands.find(req.text!)

    const args = mapObj(command.required, (value, prop) => {
      return prop === 'params'
        ? mapObj(
          value,
          (required, arg) => `${arg} | ${required ? '*needed*' : '*optional*'}\n`,
        ).join('')
        : ''
    }).join('')

    const mappedRequirements = mapObj(command.required, (value, prop) => {
      if (value && prop !== 'params')
        return prop

      if (prop === 'params' && value.obligatory === true)
        return 'arguments'
      else return false
    }).filter(el => el).join(' | ')

    embed.title = `${req.text} details`
    embed.fields = [
      {
        name: 'Description',
        value: command.description,
      },
      {
        name: 'Required',
        value: mappedRequirements || '*none*',

      },
      {
        name: 'Arguments',
        value: args || '*none*',
      },
    ]
  }

  await req.msg.channel.send({ embed })
  return await req.msg.channel.send(`Example: \`\`${Commands.prefix}COMMAND TEXT @someone ARGUMENT${Commands.separator}VALUE \`\``)
}

const help = new Action(requirements, action, description)

Commands.add('help', help)
