import { Message } from "discord.js"
import log from "../helpers/log"

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
  private _paramRegex: RegExp = /\w+-\w+/g
  private _atsRegex: RegExp = /<@!?(\d+)>/g
  private _textRegex: RegExp = /\w+-\w+\s/g

  constructor(name: string, action: DiscordAction) {
    this.name = name
    this._action = action
  }

  // @[]
  public getAt(pos: number) {
    if (this.params.ats.length > 0)
      return this.params.ats[pos]
    else
      return { id: '', tag: '' }
  }
  
  // Getting Params
  private _getParams(msg: Message) {

    const params = msg.content.match(this._paramRegex)
    if (params) params.map(el => {
      const split = el.split('-')

      if (split[0] !== 's') this.params[split[0]] = split[1]
    })

    this._getText(msg)
    this._getAts(msg)
  }

  // Gets @'s
  private _getAts(msg: Message) {
    const ats = msg.content.match(this._atsRegex)
    if (ats)
      this.params.ats = ats.map(tag => {
        return {
          tag,
          id: tag.replace(/<@!?/g, '').replace(/>/g, '')
        }
      })
  }

  // Removes params and gets text only
  private _getText(msg: Message) {
    this.params.text = msg.content
      .replace(this._textRegex, '')
      .replace(this._atsRegex, '')
  }

  public resetParams() {
    this.params = { ats: [], text: '' }
  }

  public run(msg: Message) {
    if (msg.content.match(/^s-(\w)*\s?/))
      if (msg.content.match(new RegExp(this.name))) {
        this._getParams(msg)
        this._action(msg, this)
        this.resetParams()

        log(this.params)
      }
  }
}