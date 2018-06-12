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

  public command: string = ''
  public text: string = ''
  public ats: at[] = []
  public params: DefaultParams = {}
  public hasPrefix: boolean = false

  private readonly _atsRegex = new RegExp(`<@!?(\\d+)>`, 'g')
  private readonly _rolesRegex = new RegExp(`<@&(\\d+)>`, 'g')

  constructor(
    public readonly msg: Message,
  ) {
    this._fetch()
    Performances.start('request')
    Performances.start('command')

    this.log(true)

    this._emit()
  }

  private _fetch() {
    const splits = this.msg.content.split(' ')

    const command: string | undefined = splits[0].split(Commands.prefix + Commands.separator)[1]

    if (!command) return

    //remove command
    splits.splice(0, 1)

    const params: indexObj = {}
    const ats: at[] = []

    // get props and remove them from split
    for (let i = 0; i < splits.length; i++) {
      const split = splits[i]

      i = this._getParams(split, params, splits, i)

      i = this._getAts(split, ats, splits, i)

      i = this._getRoleAts(split, ats, splits, i)
    }

    const text = splits.join(' ')

    this._setProperties({ name: command, hasPrefix: true }, params, text, ats)
  }

  private _emit() {
    Commands.event.emit(this.command, this)

    Performances.find('request').end()
  }

  private _setProperties(
    commandInfo: { name: string, hasPrefix: boolean },
    params: DefaultParams,
    text: string,
    ats: at[]
  ) {
    this.command = commandInfo.name
    this.hasPrefix = commandInfo.hasPrefix
    this.params = params
    this.text = text
    this.ats = ats
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

  private _getRoleAts(split: string, ats: at[], splits: string[], i: number) {
    if (this._rolesRegex.test(split)) {
      ats.push({
        type: 'ROLE',
        tag: split,
        id: split.replace(/<@&!?/g, '').replace(/>/g, '')
      });
      splits.splice(i, 1);
      i--;
    }
    return i;
  }

  private _getAts(split: string, ats: at[], splits: string[], i: number) {
    if (this._atsRegex.test(split)) {
      const match = split.match(/<@!(\d+)>/);
      if (match)
        ats.push({
          type: 'AT',
          tag: split,
          id: match[1]
        });
      splits.splice(i, 1);
      i--;
    }
    return i;
  }

  private _getParams(split: string, params: indexObj, splits: string[], i: number) {
    const param = split.split(Commands.separator);

    if (param[1]) {
      params[param[0]] = param[1];
      splits.splice(i, 1);
      i--;
    }
    return i;
  }
}