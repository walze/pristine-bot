import { Message } from "discord.js";
import { at } from "../types";
import { Commands } from "./Commands";
import log from "../helpers/logger";

export default class CommandRequest {
  public command: string = ''
  public text: string = ''
  public ats: at[] = []
  public params: { [key: string]: any } = {}

  private _paramRegex: RegExp = /\w+-\w+/g
  private _commandRegex: RegExp = /s-(\w+)/
  private _atsRegex: RegExp = /<@!?(\d+)>/g
  private _textRegex: RegExp = /\w+-\w+\s?/g

  constructor(
    public msg: Message,
  ) {
    this._checkIfCommand(() => {

      const paramsMatch = this.msg.content.match(this._paramRegex)
      if (paramsMatch) {

        paramsMatch.map(el => {
          const split = el.split('-')

          if (split[0] !== 's') this.params[split[0]] = split[1]
        })

        this.text = this._filterText(this.msg)
        this.ats = this._filterAts(this.msg)
      }

    })
  }

  public log(): object {
    const filtered: any = {}

    for (let prop in this)
      if (prop[0] != '_' && prop != 'msg')
        filtered[prop] = this[prop]

    log(filtered)

    return filtered
  }

  private _checkIfCommand(then: () => void) {
    const command = this.msg.content.match(this._commandRegex)

    if (command) {

      then()

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