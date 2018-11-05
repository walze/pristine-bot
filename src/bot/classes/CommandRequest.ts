import { ITextParams } from './Requirements';
import { log } from 'console'
import { Message } from "discord.js"
import { IIndexObj } from '../helpers/obj_array'
import { Iat } from "../../types"
import Commands from "./Commands"

// s-debug argument-value
// Eg. s-debug event=MEMBER_ADD_BAN amount=5 @wiva#9996
// params.argument will equals to value

export interface ICommandInfoType {
  name: string | null,
  hasPrefix: boolean
}

export interface IPropsType {
  command: ICommandInfoType
  params: IIndexObj<ITextParams>
  text: string
  ats: Iat[]
}

/**
 * Creates a command request
 *
 */
export default class CommandRequest {

  public command: string | null = null
  public text: string | null = null
  public params: IIndexObj<ITextParams> = {}
  public hasPrefix: boolean = false

  private _ats: Iat[] = []
  private readonly _commandRegex = new RegExp(`^${Commands.prefix}(\\w+)`)
  private readonly _atsRegexGlobal = new RegExp(`<@!?(\\d+)>`, 'g')
  private readonly _atsRegex = new RegExp(`<@!?(\\d+)>`)
  private readonly _rolesRegexGlobal = new RegExp(`<@&(\\d+)>`, 'g')
  // private readonly _rolesRegex = new RegExp(`<@&(\\d+)>`)

  /**
   * Gets and sets props
   */
  constructor(public readonly msg: Message) {
    const props = this._filterProps()
    if (!props || !props.command.name) return

    this._setProperties(props)
  }

  /**
   * !!!! USE METHODS GET ATS, ONLY USE THIS FOR MAPS !!!!
   */
  public get ats() {
    console.warn('!!!! USE METHODS GET ATS, ONLY USE THIS FOR MAPS !!!!')

    return [...this._ats]
  }

  public get atsLength() {
    return this._ats.length
  }

  /**
   * Throws if not found
   */
  public at(pos: number): Iat {
    const found = this._ats.find((item, i) => i === pos && item.type === 'AT')
    if (!found) throw new Error('@ expected but haven\'t got any')

    return found
  }

  /**
   * Throws if not found
   */
  public roleAt(pos: number): Iat {
    const found = this._ats.find((item, i) => i === pos && item.type === 'ROLE')
    if (!found) throw new Error('Role @ expected but haven\'t got any')

    return found
  }

  /**
   * Logs Request instance
   *
   * @param [logBool] Logs to console if true
   * @param args Additional logs
   * @returns Copy of Request
   */
  public log(logBool?: boolean, ...args: any[]): object {
    const filtered: any = {}

    for (const prop in this)
      if (prop[0] !== '_' && prop !== 'msg')
        filtered[prop] = this[prop]

    if (logBool)
      log(filtered, ...args)

    return filtered
  }

  /**
   * Sets all props of this
   */
  private _setProperties(props: IPropsType) {
    this.command = props.command.name
    this.hasPrefix = props.command.hasPrefix
    this.params = props.params
    this.text = props.text
    this._ats = props.ats
  }

  /**
   * Gets props
   */
  private _filterProps(): IPropsType | void {
    const splits = this.msg.content.split(' ')

    const commandRegex = splits[0].match(this._commandRegex)
    const command: ICommandInfoType = { name: null, hasPrefix: false }

    if (commandRegex) {
      command.name = commandRegex[1]
      command.hasPrefix = true
    } else {
      // if no regex, tries to find non-prefix command
      command.name = this._getNonPrefixCommand()

      // if no non-prefix command found, returns
      if (!command.name) return
    }

    // remove command from split
    splits.splice(0, 1)

    // gets props
    const { params, ats } = this._getAtsParams(splits)

    // joins remaining splits
    const filteredText = splits.filter(el => !!el).map(split => split.trim())
    const text = filteredText.join(' ')

    return { ats, command, params, text }
  }

  /**
   * Searches on commands if the text contains any commands that doesn't require prefix
   */
  private _getNonPrefixCommand() {
    const command = Commands.includesCommand(this.msg.content)

    if (!command) return null
    if (command.required.prefix) return null

    return command.name
  }

  /**
   */
  private _getAtsParams(splits: string[]) {
    // starts props
    const params: IIndexObj<ITextParams> = {}
    const ats: Iat[] = []

    // using object to pass reference so i won't have to do i = func()
    const indexRef = { index: 0 }

    // get props and remove them from splits
    while (indexRef.index < splits.length) {
      const split = splits[indexRef.index]

      this._getParams(split, params, splits, indexRef)
      this._getAts(split, ats, splits, indexRef)

      indexRef.index++
    }

    return { ats, params }
  }

  /**
   * Gets Ats, decrement from index and splice from splits
   */
  private _getAts(
    split: string,
    ats: Iat[],
    splits: string[],
    indexRef: { index: number },
  ) {
    if (this._rolesRegexGlobal.test(split)) {

      ats.push({
        id: split.replace(/<@&!?/g, '').replace(/>/g, ''),
        tag: split,
        type: 'ROLE',
      })

      splits.splice(indexRef.index, 1)
      indexRef.index--

    } else if (this._atsRegexGlobal.test(split)) {

      // const match = split.match(this._atsRegexGlobal)
      const match2 = split.match(this._atsRegex)

      if (!match2) return

      ats.push({
        id: match2[1],
        tag: split,
        type: 'AT',
      })

      splits.splice(indexRef.index, 1)
      indexRef.index--
    }
  }

  /**
   * Gets params/arguments
   */
  private _getParams(split: string, params: IIndexObj<ITextParams>, splits: string[], indexRef: { index: number }) {
    const param = split.split(Commands.separator)

    if (param.length > 2) throw new Error('Wrong argument syntax')

    if (!param[1]) return

    params[param[0]] = param[1]
    splits.splice(indexRef.index, 1)
    indexRef.index--

  }
}
