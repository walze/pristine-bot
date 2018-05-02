import { Message } from "discord.js";

import Command from "./Command";

export default class Commands {
  private _commands: Command[] = []

  constructor(commands: Command[]) {
    commands.map(command => this.add(command))
  }

  public list(): string[] {
    return this._commands.map(cmd => cmd.name)
  }

  public add(command: Command): void {
    this._commands.push(command)
  }

  public run(msg: Message): void {
    this._commands.map(cmd => cmd.run(msg))
  }
}