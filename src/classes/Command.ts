import Call from "./Call"
import log from "../helpers/logger";
import Commands from "./Commands";
import { RichEmbedOptions } from 'discord.js';
import { isUndefined } from 'util';
import Act from './Act';

export default class Command {
  constructor(
    public name: string,
    public act: Act,
  ) {
    Commands.event.on(this.name, (req: Call, hasPrefix: boolean) => {
      this._discordErrorDisplayer(
        this._checkRequirements(req, hasPrefix).then(() => this._run(req)),
        req
      )
    })
  }

  private _run(req: Call): void {
    const result = this.act.action(req)

    if (result instanceof Promise) this._discordErrorDisplayer(result, req)

    log(req.log())
    log(`Ran command "${req.command}" @${req.msg.guild.name}`)
  }

  private _checkRequirements(req: Call, hasPrefix: boolean) {
    return new Promise((res, rej) => {
      let errorString = ''

      if (this.act.required.prefix === hasPrefix) {
        if ((this.act.required.text !== (req.text !== '')) && this.act.required.text)
          errorString += '\nThis command requires some text'
        if ((this.act.required.ats !== (req.ats.length > 0)) && this.act.required.ats)
          errorString += '\nThis command requires @someone'

        if (this.act.required.params && this.act.required.params.obligatory)
          this.act.required.params.props.map(param => {
            if (isUndefined(req.params[param]) || !req.params[param])
              errorString += `\nArgument "${param}" is required for this command`
          })

        if (errorString === '') res()
        else rej(new Error(errorString))
      }

    })
  }

  private _discordErrorDisplayer(prom: Promise<any>, req: Call) {
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