import Command from './Command'
import Action from './Action'
import CommandRequest from './CommandRequest'

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

  public static execute(req: CommandRequest) {
    return this.find(req.command).run(req)
  }

  /**
   * Checks if text contains any commands
   */
  public static includesCommand(text: string) {
    return this.declarations.find((cmd) => text.includes(cmd.name))
  }

  /**
   * Adds command to bot
   */
  public static add(name: string, action: Action) {
    this.declarations.push(new Command(name, action))
  }

  /**
   * Throws if not found
   */
  public static find(name: string | null) {
    const found = this.declarations.find(cmd => cmd.name === name)

    if (!found) throw new Error(`Command "${name}" not found`)

    return found
  }

  /**
   * Logs all commands
   *
   * @param [everyX=3] Breaks line after logging X commands
   */
  public static log(everyX: number = 3) {
    console.log(`\nLoaded ${this.declarations.length} Commands`)

    const copy = [...this.declarations]

    for (let i = 0; i < copy.length; i += everyX) {

      const sliced = copy
        .slice(i, i + everyX)
        .map(cmd => `[${cmd.name}]  `)
        .join('')

      console.log(sliced)
    }

    console.log('\n')
  }
}

import '../commands/barrel'
