import { Message } from "discord.js";
import { at } from "../types";
import Commands from "./CommandsEventEmitter";
import { log } from 'console';
import { isString } from 'util';

export interface DefaultParams {
  [key: string]: string
  amount: string
}

// s-debug argument-value
// Eg. s-debug event-MEMBER_ADD_BAN amount-5 @wiva#9996
// params.argument will equals to value

export let prefix = 's-'
export let separator = '-'

export default class CommandRequest {

  public command: string | symbol = ''
  public text: string = ''
  public ats: at[] = []
  public params: DefaultParams = { amount: '1' }

  private _paramRegex: RegExp = new RegExp(`\\w+${separator}\\w+`, 'g')
  private _commandRegex: RegExp = new RegExp(`^${prefix}(\\w+)`)
  private _atsRegex: RegExp = new RegExp(`<@!?(\\d+)>`, 'g')
  private _textRegex: RegExp = new RegExp(`\\w+${separator}\\w+\\s?`, 'g')

  constructor(
    public msg: Message,
  ) {
    const command = this.msg.content.match(this._commandRegex)

    if (command)
      this.command = command[1]
    else {
      this.command = Commands.eventNames().filter((e) => {
        if (isString(e)) return this.msg.content.includes(e)
      })[0]

      this._commandRegex = new RegExp(`${this.command}`, 'g')
    }



    if (this.command) this._emit(Boolean(command))
  }

  private _emit(hasPrefix: boolean) {
    const paramsMatch = this.msg.content.match(this._paramRegex)

    if (paramsMatch)
      paramsMatch.map(el => {
        const split = el.split(separator)
        const prop = split[0]
        const value = split[1]

        if (split[0] !== prefix && split[0] !== prefix[0])
          this.params[prop] = value
      })

    this.text = this._filterText()
    this.ats = this._filterAts()

    Commands.emit(this.command, this, hasPrefix)
  }

  public log(logBool?: boolean, ...args: any[]): object {
    const filtered: any = {}

    for (let prop in this)
      if (prop[0] != '_' && prop != 'msg')
        filtered[prop] = this[prop]

    if (logBool)
      log(filtered, ...args)

    return filtered
  }

  public getAt(pos: number): at {
    if (this.ats.length > 0)
      return this.ats[pos]
    else
      return { id: '', tag: '' }
  }

  // Gets @'s
  private _filterAts(): at[] {
    const atsMatchеs = this.msg.content.match(this._atsRegex)
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
  private _filterText(): string {
    return this.msg.content
      .replace(this._textRegex, '')
      .replace(this._commandRegex, '')
      .replace(this._atsRegex, '')
      .trim()
  }

}