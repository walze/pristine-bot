import * as Events from 'events'
import { isString } from 'util';

const event = new Events.EventEmitter()

export default class Commands {

  public static prefix = 's-'
  public static separator = '-'
  public static event = event

  public static events = event.eventNames()

  public static findEvent(name: string) {
    return this.event.eventNames().filter((e) => {
      if (isString(e)) return name.includes(e)
    })[0]
  }
}