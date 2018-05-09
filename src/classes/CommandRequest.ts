import { Message } from "discord.js";
import { at } from "../types";
import Commands from "./CommandsEventEmmiter";
import { log } from 'console';

export interface DefaultParams {
  [key: string]: string
  amount: string
}

// s-debug argument-value
// Eg. s-debug event-MEMBER_ADD_BAN amount-5 @wiva#9996
// params.argument will equals to value

export default class CommandRequest {
  public command: string = ''
  public text: string = ''
  public ats: at[] = []
  public params: DefaultParams = { amount: '1' }

  private _paramRegex: RegExp = /\w+-\w+/g
  private _commandRegex: RegExp = /^s-(\w+)/
  private _atsRegex: RegExp = /<@!?(\d+)>/g
  private _textRegex: RegExp = /\w+-\w+\s?/g

  constructor(
    public msg: Message,
  ) {
    this._checkIfCommand(() => this._getParams())
  }

  public log(logBool?: boolean, ...extras: any[]): object {
    const filtered: any = {}

    for (let prop in this)
      if (prop[0] != '_' && prop != 'msg')
        filtered[prop] = this[prop]

    if (logBool)
      log(filtered, ...extras)

    return filtered
  }

  private _getParams() {
    const paramsMatch = this.msg.content.match(this._paramRegex)
    if (paramsMatch) {

      paramsMatch.map(el => {
        const split = el.split('-')
        const prop = split[0]
        const value = split[1]

        if (split[0] !== 's') this.params[prop] = value
      })

      this.text = this._filterText(this.msg)
      this.ats = this._filterAts(this.msg)
    }
  }

  private _checkIfCommand(callback: Function) {

    const command = this.msg.content.match(this._commandRegex)

    if (command) {

      callback()

      this.command = command[1]
      Commands.emit(this.command, this)
    }
  }

  public getAt(pos: number): at {
    if (this.ats.length > 0)
      return this.ats[pos]
    else
      return { id: '', tag: '' }
  }

  // Gets @'s
  private _filterAts(msg: Message): at[] {
    const atsMatchеs = msg.content.match(this._atsRegex)
    const ats: at[] = []

    if (atsMatchеs)
      atsMatchеs.map(tag => {
        const found = ats.find(at => at.tag === tag)

        if (!found)
          ats.push({ tag, id: tag.replace(/<@!?/g, '').replace(/>/g, '') })
      })

    return ats
  }

  // Removes params and gets text only
  private _filterText(msg: Message): string {
    return msg.content
      .replace(this._textRegex, '')
      .replace(this._atsRegex, '')
      .trim()
  }

}