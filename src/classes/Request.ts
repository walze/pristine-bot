import { Message } from "discord.js"
import { at } from "../types"
import Commands from "./Commands"
import { log } from 'console'

export interface DefaultParams { [key: string]: string }


// s-debug argument-value
// Eg. s-debug event-MEMBER_ADD_BAN amount-5 @wiva#9996
// params.argument will equals to value


export default class Request {

  public command: string | symbol = ''
  public text: string = ''
  public ats: at[] = []
  public params: DefaultParams = {}
  public hasPrefix: boolean = false

  private readonly _paramRegex = new RegExp(`\\w+${Commands.separator}\\w+`, 'g')
  private _commandRegex = new RegExp(`^${Commands.prefix}(\\w+)`)
  private readonly _atsRegex = new RegExp(`<@!?(\\d+)>`, 'g')
  private readonly _textRegex = new RegExp(`\\w+${Commands.separator}\\w+\\s?`, 'g')

  constructor(
    public readonly msg: Message,
  ) {
    const command = this.msg.content.toLowerCase().match(this._commandRegex)

    const hasPrefix = this._getCommand(command)
    this._emit(hasPrefix)
  }

  private _emit(hasPrefix: boolean) {
    this._filterArguments()
    this._filterText()
    this._filterAts()

    Commands.event.emit(this.command, this)
  }

  private _getCommand(command: RegExpMatchArray | null) {
    if (command) {
      this.command = command[1]
      this.hasPrefix = true
    }
    else {
      this.command = Commands.findEvent(this.msg.content)
      this.hasPrefix = false      
      this._commandRegex = new RegExp(`${this.command}`, 'g')
    }

    if (this.msg.author.id === this.msg.client.user.id)
      this.command = ''

    return this.hasPrefix
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