import * as Events from 'events'
import { isString } from 'util';
import Command from './Command';
import Action from './Action';

const event = new Events.EventEmitter()

export default class Commands {

  public static declarations: Command[] = []

  public static prefix = 's-'
  public static separator = '='

  public static readonly events = event.eventNames()
  public static readonly event = event

  public static findEvent(name: string) {
    return this.events
      .find(e => isString(e) ? name.includes(e) : false)
      || ''
  }

  public static includesCommand(text: string) {
    return this.declarations.find((cmd) => text.includes(cmd.name))
  }

  public static add(name: string, action: Action) {
    this.declarations.push(new Command(name, action))
  }

  public static find(name: string) {
    const found = this.declarations.find(cmd => cmd.name === name)

    if (!found) throw new Error(`Command "${name}" not found`)

    return found
  }

  public static log(everyX: number = 3) {
    console.log(`Loaded ${this.declarations.length} Commands`)

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
