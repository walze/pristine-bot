import { Message } from "discord.js";
import log from "../helpers/logger";

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