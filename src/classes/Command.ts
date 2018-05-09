import CommandRequest from "./CommandRequest"
import { action } from "../types"
import log from "../helpers/logger";
import Commands from "./CommandsEventEmmiter";
import { RichEmbedOptions } from 'discord.js';
import { AxiosError } from 'axios';

export default class Command {
  constructor(
    public name: string,
    private _action: action<any>
  ) {
    Commands.on(this.name, (request: CommandRequest) => {
      this._run(request)
      log(`Ran command "${request.command}" @${request.msg.guild.name}`)
    })

  }

  private _run(req: CommandRequest): void {

    const result = this._action(req)

    if (result instanceof Promise) this._handleError(result, req)
  }

  private _handleError(prom: Promise<any>, req: CommandRequest) {
    prom
      .catch((err: AxiosError) => {
        log('COMMAND CATCH LOG:', err)

        const embed: RichEmbedOptions = {
          url: 'https://en.wikipedia.org/wiki/List_of_HTTP_status_codes',
          description: 'Something went wrong with your request. Possibly there were no matching results.',
          author: {
            name: req.msg.author.username,
            icon_url: req.msg.author.avatarURL
          },
          title: "Error Information",
          fields: [
            {
              name: "Message",
              value: err.message,
              inline: true
            },
            {
              name: 'Request Arguments',
              value: `\`\`${JSON.stringify(req.log(false))}\`\``
            }
          ],
          timestamp: new Date()
        }


        req.msg.channel.send({ embed })
      })
  }
}