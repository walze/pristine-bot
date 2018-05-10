import CommandRequest from "./CommandRequest"
import { action } from "../types"
import log from "../helpers/logger";
import Commands from "./CommandsEventEmitter";
import { RichEmbedOptions } from 'discord.js';
import { isUndefined } from 'util';

export interface Requirements {
  prefix?: boolean,
  text?: boolean,
  ats?: boolean,
}

export default class Command {
  constructor(
    public name: string,
    private _action: action<any>,
    public required: Requirements = {}
  ) {
    this.required = {
      prefix: isUndefined(required.prefix) ? true : required.prefix,
      text: isUndefined(required.text) ? true : required.text,
      ats: isUndefined(required.ats) ? false : required.ats
    }

    Commands.on(this.name, (request: CommandRequest, hasPrefix: boolean) =>
      this._handleError(
        this._checkRequirements(request, hasPrefix).then(() => this._run(request)),
        request
      )
    )
  }

  private _checkRequirements(request: CommandRequest, hasPrefix: boolean) {
    return new Promise((res, rej) => {
      let errorString = ''

      if (this.required.prefix === hasPrefix) {
        if (this.required.text !== (request.text !== ''))
          errorString += '\nThis command requires some text'
        if (this.required.ats !== (request.ats.length > 0))
          errorString += '\nThis command requires @someone'

        if (errorString === '') res()
        else rej(new Error(errorString))
      }

    })
  }

  private _run(req: CommandRequest): void {
    const result = this._action(req)

    if (result instanceof Promise) this._handleError(result, req)

    log(req.log())
    log(`Ran command "${req.command}" @${req.msg.guild.name}`)
  }

  private _handleError(prom: Promise<any>, req: CommandRequest) {
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