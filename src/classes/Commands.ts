import * as Events from 'events'
import { isString } from 'util';
import Command from './Command';
import Action from './Act';

const event = new Events.EventEmitter()

export default class Commands {

  static declarations: Command[] = []
  static prefix = 's-'
  static separator = '-'
  static readonly event = event

  static readonly events = event.eventNames()

  static findEvent(name: string) {
    const found = this.event.eventNames().find((e) => {
      if (isString(e)) return name.includes(e)
      else return false
    })

    if (found) return found
    else return ''
  }

  static includesCommand(text: string) {
    const found = this.declarations.find((cmd) => {
      return text.includes(cmd.name)
    })

    return found
  }

  static add(name: string, action: Action) {
    this.declarations.push(new Command(name, action))
  }

  static find(name: string) {
    const found = this.declarations.find(cmd => cmd.name === name)
    if (found) return found

    throw new Error(`Command "${name}" not found`)
  }

  static log() {
    const text = `\nListening to Commands:\n${this.declarations.map(cmd => cmd.name).join('\n')}`
    console.log(text)
  }
}