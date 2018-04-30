import { Message } from "discord.js";

export default class Command {
  public name: string
  public params: { [key: string]: string | string[] } = {}
  private _action: DiscordAction

  constructor(name: string, action: DiscordAction) {
    this.name = name
    this._action = action
  }

  private _getParams(msg: Message) {
    const paramRegex = /\w+-\w+/g;
    const params = msg.content.match(paramRegex)

    const tagged = msg.content.match(/<@!?(.+?)>/g)
    
    if (tagged)
      this.params.tagged = tagged

    if (params)
      params.map(el => {
        const split = el.split('-')

        if (split[0] !== 's')
          this.params[split[0]] = split[1]
      })
  }

  public resetParams() {
    this.params = {}
  }

  public run(msg: Message) {
    return new Promise(done => {
      if (msg.content.match(/^s-(\w)*\s?/))
        if (msg.content.match(new RegExp(this.name))) {
          this._getParams(msg)
          this._action(msg, this)

          done()
        }
    })
  }


}