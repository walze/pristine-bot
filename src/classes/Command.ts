import { Message } from "discord.js"
import log from "../helpers/logger"
import Parameters from "./Parameters";

export type DiscordAction<T = Parameters> = (message: Message, parameters: Parameters & T) => void

export default class Command {
  public name: string
  private _action: DiscordAction<any>

  constructor(name: string, action: DiscordAction<any>) {
    this.name = name
    this._action = action
  }

  @checkIfCommand
  public run(msg: Message): void {
    this._action(msg, new Parameters(msg))
  }
}

export function checkIfCommand(target: any, key: string, descriptor: any) {
  const action = descriptor.value;

  descriptor.value = function (msg: Message) {
    if (msg.content.match(/^s-(\w)*\s?/))
      if (msg.content.match(new RegExp(`s-${this.name}`))) {
        // runs action
        action.apply(this, arguments)
        log('Command:', this.name)
      }

  }
  return descriptor;
}
