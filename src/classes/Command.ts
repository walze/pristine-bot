import { Message } from "discord.js";

export default class Command {
  public name: string
  private _action: DiscordAction

  constructor(name: string, action: DiscordAction) {
    this.name = name
    this._action = action
  }

  run(msg: Message) {
    if (msg.content.match(/^s-(\w)*\s?/))
      if (msg.content.match(new RegExp(this.name)))
        return this._action(msg)
  }

}