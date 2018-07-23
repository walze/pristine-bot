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
  command: ICommandInfoType;
  params: IIndexObj;
  text: string;
  ats: Iat[];
}

/**
 * Creates a command request
 *
 */
export default class CommandRequest {

  public command: string | null = null
  public text: string | null = null
  public ats: Iat[] = []
  public params: IIndexObj = {}
  public hasPrefix: boolean = false

  private readonly _commandRegex = new RegExp(`^${Commands.prefix}(\\w+)`)
  private readonly _atsRegexGlobal = new RegExp(`<@!?(\\d+)>`, 'g')
  private readonly _atsRegex = new RegExp(`<@!?(\\d+)>`)
  private readonly _rolesRegexGlobal = new RegExp(`<@&(\\d+)>`, 'g')
  // private readonly _rolesRegex = new RegExp(`<@&(\\d+)>`)

  constructor(public readonly msg: Message) {
    const props = this._filterProps()
    if (!props || !props.command.name) return

    this._setProperties(props)
  }

  /**
   * Throws if not found
   *
   * @param {number} pos
   * @returns {Iat}
   * @memberof CommandRequest
   */
  public getAt(pos: number): Iat {
    const found = this.ats.find((item, i) => i === pos && item.type === 'AT')
    if (!found) throw new Error('@ not found')

    return found
  }

  /**
   * Throws if not found
   *
   * @param {number} pos
   * @returns {Iat}
   * @memberof CommandRequest
   */
  public getAtRole(pos: number): Iat {
    const found = this.ats.find((item, i) => i === pos && item.type === 'ROLE')
    if (!found) throw new Error('Role @ not found')

    return found
  }

  /**
   * Logs Request instance
   *
   * @param {boolean} [logBool] Logs to console if true
   * @param {...any[]} args Additional logs
   * @returns {object} Copy of Request
   * @memberof CommandRequest
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
   * Emits command request
   */
  public emit() {
    Commands.event.emit(this.command!, this)
  }

  /**
   * Sets all props of this
   *
   * @private
   * @param {IPropsType} props
   * @memberof CommandRequest
   */
  private _setProperties(props: IPropsType) {
    this.command = props.command.name
    this.hasPrefix = props.command.hasPrefix
    this.params = props.params
    this.text = props.text
    this.ats = props.ats
  }

  /**
   * Gets props
   *
   * @private
   * @returns {(IPropsType | void)}
   * @memberof CommandRequest
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

    return {
      ats,
      command,
      params,
      text,
    }
  }

  /**
   * Searches on commands if the text contains any commands that doesn't require prefix
   *
   * @private
   * @returns
   * @memberof CommandRequest
   */
  private _getNonPrefixCommand() {
    const command = Commands.includesCommand(this.msg.content)

    if (!command) return null
    if (command.action.required.prefix) return null

    return command.name
  }

  /**
   *
   * @private
   * @param {string[]} splits
   * @returns
   * @memberof CommandRequest
   */
  private _getAtsParams(splits: string[]) {
    // starts props
    const params: IIndexObj = {}
    const ats: Iat[] = []

    // using array to pass reference so i won't have to do i = func()
    const i = [0];

    // get props and remove them from splits
    while (i[0] < splits.length) {
      const split = splits[i[0]];

      this._getParams(split, params, splits, i);
      this._getAts(split, ats, splits, i);
      this._getRoleAts(split, ats, splits, i);

      i[0]++;
    }

    return {
      ats,
      params,
    }
  }

  /**
   *
   *
   * @private
   * @param {string} split
   * @param {Iat[]} ats
   * @param {string[]} splits
   * @param {number[]} i
   * @returns
   * @memberof CommandRequest
   */
  private _getRoleAts(split: string, ats: Iat[], splits: string[], i: number[]) {
    if (!this._rolesRegexGlobal.test(split)) return false

    ats.push({
      id: split.replace(/<@&!?/g, '').replace(/>/g, ''),
      tag: split,
      type: 'ROLE',
    })
    splits.splice(i[0], 1)
    i[0]--

    return true
  }

  /**
   *
   *
   * @private
   * @param {string} split
   * @param {Iat[]} ats
   * @param {string[]} splits
   * @param {number[]} i
   * @returns
   * @memberof CommandRequest
   */
  private _getAts(split: string, ats: Iat[], splits: string[], i: number[]) {
    if (!this._atsRegexGlobal.test(split)) return false

    const match = split.match(this._atsRegexGlobal)
    const match2 = split.match(this._atsRegex)

    if (!match || !match2) return false

    ats.push({
      id: match2[1],
      tag: split,
      type: 'AT',
    })
    splits.splice(i[0], 1)
    i[0]--

    return true
  }

  /**
   *
   *
   * @private
   * @param {string} split
   * @param {IIndexObj} params
   * @param {string[]} splits
   * @param {number[]} i
   * @returns
   * @memberof CommandRequest
   */
  private _getParams(split: string, params: IIndexObj, splits: string[], i: number[]) {
    const param = split.split(Commands.separator)

    if (!param[1]) return false

    params[param[0]] = param[1]
    splits.splice(i[0], 1)
    i[0]--

    return true
  }
}
