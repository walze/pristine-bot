import { Message } from "discord.js";

import Command from "./Command";
import declarations from '../commands/declarations'
import log from "../helpers/log";

export default class Commands {
  private _commands: Command[] = declarations

  constructor() {
    log('Listening to Commands', this._commands.map(cmd => cmd.name))
  }

  public add(command: Command) {
    return this._commands.push(command)
  }

  public run(msg: Message) {
    return this._commands.map(cmd => cmd.run(msg))
  }
}