import { Message } from "discord.js"
import { at } from "../types"
import Commands from "./Commands"
import { log } from 'console'
import { indexObj } from '../helpers/obj_array';
import { Performances } from './Performances';

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
  private _shouldEmit: boolean = false

  private readonly _paramRegex = new RegExp(`\\w+${Commands.separator}\\w+`, 'g')
  private _commandRegex = new RegExp(`^${Commands.prefix}(\\w+)`)
  private readonly _atsRegex = new RegExp(`<@!?(\\d+)>`, 'g')
  private readonly _textRegex = new RegExp(`\\w+${Commands.separator}\\w+\\s?`, 'g')

  constructor(
    public readonly msg: Message,
  ) {
    Performances.test('request')
    Performances.test('command')

    this._emit(
      this._getCommandName()
    )
  }

  private _emit(command: string | symbol) {
    if (!this._shouldEmit) return

    this.command = command
    this.params = this._filterArguments()
    this.text = this._filterText()
    this.ats = this._filterAts()

    const perf = Performances.find('request')
    if (perf) perf.done()

    Commands.event.emit(this.command, this)
  }

  private _getCommandName() {
    if (this.msg.author.id === this.msg.client.user.id) return ''

    let match = this.msg.content.toLowerCase().match(this._commandRegex)
    let commandName = ''

    if (match) {
      commandName = match[1]
      this.hasPrefix = true
    } else {
      commandName = this._getNonPrefixCommand()
      this._commandRegex = new RegExp(`${commandName}`, 'g')
    }

    if (commandName != '')
      this._shouldEmit = true

    return commandName
  }

  private _getNonPrefixCommand() {
    const command = Commands.includesCommand(this.msg.content)
    if (!command) return ''

    if (command.act.required.prefix) return ''

    return command.name
  }

  private _filterArguments() {
    const paramsMatch = this.msg.content.toLowerCase().match(this._paramRegex)
    const params: indexObj = {}

    if (paramsMatch)
      paramsMatch.map(el => {
        const split = el.split(Commands.separator)
        const prop = split[0]
        const value = split[1]
        if (split[0] !== Commands.prefix && split[0] !== Commands.prefix[0])
          params[prop] = value
      })

    return params
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
    const at = this.ats[pos]
    if (at) return at

    throw new Error('At not found')
  }

  // Gets @'s
  private _filterAts() {
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
  private _filterText() {
    return this.msg.content
      .replace(this._textRegex, '')
      .replace(this._commandRegex, '')
      .replace(this._atsRegex, '')
      .trim()
  }

}