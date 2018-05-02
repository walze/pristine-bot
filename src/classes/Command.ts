import { Message } from "discord.js"
import log from "../helpers/logger"
import Parameters from "./Parameters";

export type DiscordAction = (msg: Message, params: Parameters) => void

export default class Command {
  public name: string
  private _action: DiscordAction

  constructor(name: string, action: DiscordAction) {
    this.name = name
    this._action = action
  }

  @checkIfCommand
  public run(msg: Message): void {
    const params = new Parameters(msg)
    this._action(msg, params)
  }
}

export function checkIfCommand(target: any, key: string, descriptor: any) {
  const action = descriptor.value;

  descriptor.value = function () {
    const msg = arguments[0]

    if (msg.content.match(/^s-(\w)*\s?/))
      if (msg.content.match(new RegExp(this.name))) {
        // runs action
        action.apply(this, arguments)
        log('Command ran', this.name)
      }

  }
  return descriptor;
}
