import * as Events from 'events'
import { isString } from 'util';
import Command from './Command';
import Action from './Action';

const event = new Events.EventEmitter()

export default class Commands {

  public static declarations: Command[] = []
  public static prefix = 's-'
  public static readonly events = event.eventNames()
  public static separator = '-'
  public static readonly event = event

  public static findEvent(name: string) {
    const found = this.event.eventNames().find((e) => {
      if (isString(e)) return name.includes(e)
      else return false
    })

    if (found) return found
    else return ''
  }

  public static includesCommand(text: string) {
    const found = this.declarations.find((cmd) => {
      return text.includes(cmd.name)
    })

    return found
  }

  public static add(name: string, action: Action) {
    this.declarations.push(new Command(name, action))
  }

  public static find(name: string) {
    const found = this.declarations.find(cmd => cmd.name === name)
    if (found) return found

    throw new Error(`Command "${name}" not found`)
  }

  public static log() {
    console.log(`Listening to ${this.declarations.length} Commands`)

    this.declarations.map((cmd, i) => {
      if (i % 2 === 0 && i + 1 < this.declarations.length)
        console.log(`| ${cmd.name} || ${this.declarations[i + 1].name} |`)
      else if (i + 1 === this.declarations.length)
        console.log(`| ${cmd.name} |`)

    })
  }
}
