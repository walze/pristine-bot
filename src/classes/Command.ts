import Request from "./Request"
import log from "../helpers/logger";
import Commands from "./Commands";
import { RichEmbedOptions } from 'discord.js';
import Act from './Act';
import { mapObj } from '../helpers/obj_array';
import { Performances } from './Performances';

export default class Command {
  constructor(
    public name: string,
    public act: Act,
  ) {
    Commands.event.on(this.name, (req: Request) => {
      const result = this._checkRequirements(req)

      if (result === false) return
      if (result instanceof Error) this._errorHandler(req, result)
      else this._run(req)
    })
  }

  private async _run(req: Request) {
    let returns = undefined

    try {
      const result = this.act.action(req)

      if (result instanceof Promise)
        returns = await result.catch(err => this._errorHandler(req, err))

      log('warning action returned non-promise: '.toUpperCase(), req.command)

    } catch (err) {
      returns = await this._errorHandler(req, err)
    }

    const cmdPerf = Performances.find('command')
    log(`Ran command "${req.command}" @${req.msg.guild.name}`)

    if (cmdPerf) cmdPerf.done()

    return returns
  }

  // Error = has error
  // False = isn't command
  // Void = no errors
  private _checkRequirements(req: Request): Error | false | void {
    let errorString = ''

    if (this.act.required.prefix === req.hasPrefix) {
      if ((this.act.required.text !== (req.text !== '')) && this.act.required.text)
        errorString += '\nThis command requires some text'
      if ((this.act.required.ats !== (req.ats.length > 0)) && this.act.required.ats)
        errorString += '\nThis command requires @someone'

      mapObj(this.act.required.params, (required, prop) => {
        if (!req.params[prop] && required)
          errorString += `\nArgument "${prop}" is required for this command`
      })

      if (errorString !== '') return new Error(errorString)
    }
    else return false
  }

  private _errorHandler(req: Request, err: Error) {
    log('COMMAND CATCH LOG:', err, req.log())

    const embed: RichEmbedOptions = {
      author: {
        name: req.msg.author.username,
        icon_url: req.msg.author.avatarURL
      },
      title: "Error Information",
      description: err.message,
      fields: [
        {
          name: 'Command',
          value: req.command,
          inline: true
        },
        {
          name: 'Text',
          value: req.text || '*empty*',
          inline: true
        },
        {
          name: '@\'s',
          value: req.ats.length > 0 ? req.ats.map(at => at.tag).join(' | ') : '*none*',
          inline: true
        },
        {
          name: 'Arguments',
          value: mapObj(req.params, (val, name) => `${name}-${val}`).join(' | ') || '*none*',
          inline: true
        }
      ],
      timestamp: new Date()
    }

    return req.msg.channel.send(`Use help __${req.command}__ for more information about this command.`, { embed })
  }
}