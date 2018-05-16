import Request from "./Request"
import log from "../helpers/logger";
import Commands from "./Commands";
import { RichEmbedOptions } from 'discord.js';
import Act from './Act';
import { mapObj } from '../helpers/obj_array';

export default class Command {
  constructor(
    public name: string,
    public act: Act,
  ) {
    Commands.event.on(this.name, (req: Request, hasPrefix: boolean) => {
      this._discordErrorDisplayer(
        this._checkRequirements(req, hasPrefix).then(req => this._run(req)),
        req
      )
    })
  }

  private _run(req: Request): void {
    const result = this.act.action(req)

    if (result instanceof Promise) this._discordErrorDisplayer(result, req)

    log(`Ran command "${req.command}" @${req.msg.guild.name}`)
  }

  private _checkRequirements(req: Request, hasPrefix: boolean) {
    return new Promise((res: (request: Request) => void, rej) => {
      let errorString = ''

      if (this.act.required.prefix === hasPrefix) {
        if ((this.act.required.text !== (req.text !== '')) && this.act.required.text)
          errorString += '\nThis command requires some text'
        if ((this.act.required.ats !== (req.ats.length > 0)) && this.act.required.ats)
          errorString += '\nThis command requires @someone'

        mapObj(this.act.required.params, (required, prop) => {
          if (!req.params[prop] && required)
            errorString += `\nArgument "${prop}" is required for this command`
        })

        if (errorString === '') res(req)
        else rej(new Error(errorString))
      }

    })
  }

  private _discordErrorDisplayer(prom: Promise<any>, req: Request) {

    prom.catch((err: Error) => {
      log('COMMAND CATCH LOG:', err.stack)

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
            value: mapObj(req.params, (val, name) => `${name}-${val}`).join(' | '),
            inline: true
          }
        ],
        timestamp: new Date()
      }

      req.msg.channel.send(`Use help __${req.command}__ for more information about this command.`, { embed })
    })
  }
}