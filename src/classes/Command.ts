import Request from "./Request"
import { action } from "../types"
import log from "../helpers/logger";
import Commands from "./Commands";
import { RichEmbedOptions } from 'discord.js';
import { isUndefined } from 'util';
import { Requirements } from './Requirements';

export default class Command {
  constructor(
    public name: string,
    private _action: action<any>,
    public required = new Requirements
  ) {
    this.required = new Requirements(required)

    Commands.event.on(this.name, (request: Request, hasPrefix: boolean) =>
      this._discordErrorDisplayer(
        this._checkRequirements(request, hasPrefix).then(() => this._run(request)),
        request
      )
    )
  }

  private _checkRequirements(request: Request, hasPrefix: boolean) {
    return new Promise((res, rej) => {
      let errorString = ''

      if (this.required.prefix === hasPrefix) {
        if ((this.required.text !== (request.text !== '')) && this.required.text)
          errorString += '\nThis command requires some text'
        if (this.required.ats !== (request.ats.length > 0))
          errorString += '\nThis command requires @someone'

        if (this.required.params && this.required.params.obligatory)
          this.required.params.props.map(param => {
            if (isUndefined(request.params[param]) || !request.params[param])
              errorString += `\nArgument "${param}" is required for this command`
          })

        if (errorString === '') res()
        else rej(new Error(errorString))
      }

    })
  }

  private _run(req: Request): void {
    const result = this._action(req)

    if (result instanceof Promise) this._discordErrorDisplayer(result, req)

    log(req.log())
    log(`Ran command "${req.command}" @${req.msg.guild.name}`)
  }

  private _discordErrorDisplayer(prom: Promise<any>, req: Request) {
    prom
      .catch((err: Error) => {
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
              name: 'Request Arguments',
              value: `\`\`\`json\n${JSON.stringify(req.log(false))}\`\`\``,
              inline: true
            }
          ],
          timestamp: new Date()
        }


        req.msg.channel.send('Something went wrong with your request, check your syntax.', { embed })
      })
  }
}