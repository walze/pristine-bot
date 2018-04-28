import { Message } from "discord.js";

export default class Command {
  public name: string
  public action: DiscordAction

  constructor(name: string, action: DiscordAction) {
    this.name = name
    this.action = action

  }

  run(message: Message) {
    return this.action(message)
  }

}