import { Message } from "discord.js";

export interface At {
  id: string,
  tag: string
}

export default class Parameters {
  [key: string]: any
  public text: string
  public ats: At[]
  private _emptyAt: At = { id: '', tag: '' }
  private _paramRegex: RegExp = /\w+-\w+/g
  private _atsRegex: RegExp = /<@!?(\d+)>/g
  private _textRegex: RegExp = /\w+-\w+\s?/g

  constructor(msg: Message) {
    const paramsMatch = msg.content.match(this._paramRegex)
    if (paramsMatch) paramsMatch.map(el => {
      const split = el.split('-')

      if (split[0] !== 's') this[split[0]] = split[1]
    })

    this.text = this._filterText(msg)
    this.ats = this._filterAts(msg)
  }

  public getAt(pos: number): At {
    if (this.ats.length > 0)
      return this.ats[pos]
    else
      return this._emptyAt
  }

  // Gets @'s
  private _filterAts(msg: Message): At[] {
    const atsMatchеs = msg.content.match(this._atsRegex)
    const ats: At[] = []

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