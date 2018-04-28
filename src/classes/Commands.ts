import Command from "./Command";
import { isArray } from "util";
import { Message } from "discord.js";

export default class Commands {
  private _commands: Command[] = []

  public add(commands: Command | Command[]) {
    if (isArray(commands))
      commands.map(cmd => this._commands.push(cmd))
    else
      this._commands.push(commands)
  }

  public run(msg: Message) {
    this._commands.map(cmd => cmd.run(msg))
  }
}