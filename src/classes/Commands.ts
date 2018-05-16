import * as Events from 'events'
import { isString } from 'util';
import Command from './Command';

const event = new Events.EventEmitter()

export default class Commands {

  static declarations: Command[]
  static prefix = 's-'
  static separator = '-'
  static event = event

  static events = event.eventNames()

  static findEvent(name: string) {
    return this.event.eventNames().filter((e) => {
      if (isString(e)) return name.includes(e)
    })[0]
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