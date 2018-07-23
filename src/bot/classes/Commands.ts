import * as Events from 'events'
import { isString } from 'util';
import Command from './Command';
import Action from './Action';

const event = new Events.EventEmitter()

/**
 * Handles all bot's commands
 *
 * @export
 * @class Commands
 */
export default class Commands {

  public static declarations: Command[] = []

  public static prefix = 's-'
  public static separator = '='

  public static readonly events = event.eventNames()
  public static readonly event = event

  /**
   *
   *
   * @static
   * @param {string} name
   * @returns
   * @memberof Commands
   */
  public static findEvent(name: string) {
    return this.events
      .find(e => isString(e) ? name.includes(e) : false)
      || ''
  }

  /**
   * Checks if text contains any commands
   *
   * @static
   * @param {string} text
   * @returns
   * @memberof Commands
   */
  public static includesCommand(text: string) {
    return this.declarations.find((cmd) => text.includes(cmd.name))
  }

  /**
   * Adds command to bot
   *
   * @static
   * @param {string} name
   * @param {Action} action
   * @memberof Commands
   */
  public static add(name: string, action: Action) {
    this.declarations.push(new Command(name, action))
  }

  /**
   * Throws if not found
   *
   * @static
   * @param {string} name
   * @returns
   * @memberof Commands
   */
  public static find(name: string) {
    const found = this.declarations.find(cmd => cmd.name === name)

    if (!found) throw new Error(`Command "${name}" not found`)

    return found
  }

  /**
   * Logs all commands
   *
   * @static
   * @param {number} [everyX=3] Breaks line after logging X commands
   * @returns
   * @memberof Commands
   */
  public static log(everyX: number = 3) {
    console.log(`\nLoaded ${this.declarations.length} Commands`)

    let string = ''

    this.declarations.map((cmd, i) => {
      if (i % everyX === 0 && i !== 0)
        string += `| ${cmd.name} |\n`
      else
        string += `| ${cmd.name} | `
    })

    console.log(string)

    return string
  }
}
