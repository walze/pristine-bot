import { Message } from "discord.js"
import { at } from "../types"
import Commands from "./Commands"
import { log } from 'console'

export interface DefaultParams {
  [key: string]: string
  amount: string
}


// s-debug argument-value
// Eg. s-debug event-MEMBER_ADD_BAN amount-5 @wiva#9996
// params.argument will equals to value


export default class Call {

  public command: string | symbol = ''
  public text: string = ''
  public ats: at[] = []
  public params: DefaultParams = { amount: '1' }

  private _paramRegex: RegExp = new RegExp(`\\w+${Commands.separator}\\w+`, 'g')
  private _commandRegex: RegExp = new RegExp(`^${Commands.prefix}(\\w+)`)
  private _atsRegex: RegExp = new RegExp(`<@!?(\\d+)>`, 'g')
  private _textRegex: RegExp = new RegExp(`\\w+${Commands.separator}\\w+\\s?`, 'g')

  constructor(
    public msg: Message,
  ) {
    const command = this.msg.content.toLowerCase().match(this._commandRegex)

    if (this._getCommand(command))
      this._emit(Boolean(command))
  }

  private _emit(hasPrefix: boolean) {
    this._filterArguments()
    this._filterText()
    this._filterAts()

    Commands.event.emit(this.command, this, hasPrefix)
  }

  private _getCommand(command: RegExpMatchArray | null) {
    if (command)
      this.command = command[1]
    else {
      this.command = Commands.findEvent(this.msg.content)

      this._commandRegex = new RegExp(`${this.command}`, 'g')
    }

    return this.command
  }

  private _filterArguments() {
    const paramsMatch = this.msg.content.toLowerCase().match(this._paramRegex)
    if (paramsMatch)
      paramsMatch.map(el => {
        const split = el.split(Commands.separator)
        const prop = split[0]
        const value = split[1]
        if (split[0] !== Commands.prefix && split[0] !== Commands.prefix[0])
          this.params[prop] = value
      })
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
  private _filterAts(): void {
    const atsMatchеs = this.msg.content.match(this._atsRegex)
    const ats: at[] = []

    if (atsMatchеs)
      atsMatchеs.map(tag => {
        const found = ats.find(at => at.tag === tag)

        if (!found)
          ats.push({ tag, id: tag.replace(/<@!?/g, '').replace(/>/g, '') })
      })

    this.ats = ats
  }

  // Removes params and gets text only
  private _filterText() {
    this.text = this.msg.content
      .replace(this._textRegex, '')
      .replace(this._commandRegex, '')
      .replace(this._atsRegex, '')
      .trim()
  }

}