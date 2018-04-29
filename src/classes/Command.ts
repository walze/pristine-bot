import { Message } from "discord.js";

export default class Command {
  public name: string
  public params: string[] = []
  private _action: DiscordAction

  constructor(name: string, action: DiscordAction) {
    this.name = name
    this._action = action
  }

  run(msg: Message) {
    if (msg.content.match(/^s-(\w)*\s?/))
      if (msg.content.match(new RegExp(this.name))) {
        const paramRegex = /--\w+/g;
        const params = msg.content.match(paramRegex)

        if (params) this.params = params.map(prm => prm.replace(/--/g, ''))

        this._action(msg, this)

        this.params.length = 0
      }
  }

}