import { Message } from "discord.js";
import log from "../helpers/log";

export type DiscordAction = (msg: Message, reference: Command) => void

export interface At {
  id: string,
  tag: string
}

export interface CommandParams {
  [key: string]: any
  ats: At[],
  text: string
}

export default class Command {
  public name: string
  public params: CommandParams = { ats: [], text: '' }
  private _action: DiscordAction

  constructor(name: string, action: DiscordAction) {
    this.name = name
    this._action = action
  }

  // @[]
  public ats(pos: number) {
    if (this.params.ats.length > 0)
      return this.params.ats[pos]
    else
      return { id: '', tag: '' }
  }

  private _getParams(msg: Message) {
    const paramRegex: RegExp = /\w+-\w+/g;
    const textRegex: RegExp = /\w+-\w+\s/g;

    // Getting Params
    const params = msg.content.match(paramRegex)
    if (params) params.map(el => {
      const split = el.split('-')

      if (split[0] !== 's') this.params[split[0]] = split[1]
    })

    // Removes params and gets text only
    let text = msg.content
    const blacklist = text.match(textRegex)

    if (blacklist)
      blacklist.map((blacklist: string) => text = text.replace(blacklist, ''))

    this.params.text = text

    // Getting @'s
    const ats = msg.content.match(/<@!?([^>]+)>/g)
    if (ats)
      this.params.ats = ats.map(tag => {
        return {
          tag,
          id: tag.replace(/<@!?/g, '').replace(/>/g, '')
        }
      })
  }

  public resetParams() {
    this.params = { ats: [], text: '' }
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