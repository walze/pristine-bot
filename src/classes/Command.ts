import { Message } from "discord.js";
import log from "../helpers/log";

export type DiscordAction = (msg: Message, reference: Command) => void

export interface At {
  id: string,
  tag: string
}

export interface CommandParams {
  [key: string]: any
  ats: At[]
}

export default class Command {
  public name: string
  public params: CommandParams = { ats: [] }
  private _action: DiscordAction
  private _paramRegex: RegExp = /\w+-\w+/g;

  constructor(name: string, action: DiscordAction) {
    this.name = name
    this._action = action
  }

  // @s
  public ats(pos: number) {
    if (this.params.ats.length > 0)
      return this.params.ats[pos]
    else
      return { id: '', tag: '' }
  }

  private _getParams(msg: Message) {

    const ats = msg.content.match(/<@!?(.+?)>/g)
    if (ats)
      this.params.ats = ats.map(tag => {
        return {
          tag,
          id: tag.replace(/<@!?/g, '').replace(/>/g, '')
        }
      })

    const params = msg.content.match(this._paramRegex)
    if (params) params.map(el => {
      const split = el.split('-')

      if (split[0] !== 's') this.params[split[0]] = split[1]
    })
  }

  public resetParams() {
    this.params = { ats: [] }
  }

  public run(msg: Message) {
    return new Promise(done => {
      if (msg.content.match(/^s-(\w)*\s?/))
        if (msg.content.match(new RegExp(this.name))) {
          this._getParams(msg)
          this._action(msg, this)

          log(this.params)
          done()
        }
    })
  }


}