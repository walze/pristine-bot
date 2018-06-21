import Action from './Action';
import Commands from "./Commands";
import { Performances } from './Performances';
import Request from "./Request";
import log from "../helpers/logger";
import { RichEmbedOptions } from 'discord.js';
import { mapObj } from '../helpers/obj_array';

export default class Command {

  constructor(public name: string, public action: Action) {

    Commands.event.on(this.name, (req: Request) => {
      log(`|| running "${req.msg.author.username}'s" command "${req.command}" at "${req.msg.guild.name}"...`)
      try {
        this._checkRequirements(req)
        this._run(req)
      } catch (e) {
        this._errorHandler(req, e)
      }

    })

  }

  private async _run(req: Request) {
    try {
      const result = await this.action.run(req)

      Performances.find('command').end()
      return result
    } catch (err) {
      return this._errorHandler(req, err)
    }
  }

  private _checkRequirements(req: Request): void {
    let errorString = ''

    if (this.action.required.prefix === req.hasPrefix) {
      if ((this.action.required.text !== (req.text !== '')) && this.action.required.text)
        errorString += '\nThis command requires some text'
      if ((this.action.required.ats !== (req.ats.length > 0)) && this.action.required.ats)
        errorString += '\nThis command requires @someone'

      mapObj(this.action.required.params, (required, prop) => {
        if (!req.params[prop] && required)
          errorString += `\nArgument "${prop}" is required for this command`
      })

      if (errorString === '') return

      throw new Error(errorString)
    }

    throw new Error('Prefix required and wasn\'t given')
  }

  private _errorHandler(req: Request, err: Error) {
    log(err)
    req.log(true)

    const embed: RichEmbedOptions = {
      title: "Error Information",
      description: err.message,
      fields: [
        {
          name: 'Command',
          value: req.command,
          inline: true,
        },
        {
          name: 'Text',
          value: req.text || '*empty*',
          inline: true,
        },
        {
          name: '@\'s',
          value: req.ats.length > 0 ? req.ats.map(at => at.tag).join(' | ') : '*none*',
          inline: true,
        },
        {
          name: 'Arguments',
          value: mapObj(req.params, (val, name) => `${name}-${val}`).join(' | ') || '*none*',
          inline: true,
        },
      ],
    }

    return req.msg.reply(`sorry but I couldn't complete your request >///<\nBut you can try using *help* __${req.command}__ to know more about this command cx`, { embed })
  }
}
