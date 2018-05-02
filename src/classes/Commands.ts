import { Message } from "discord.js";

import Command from "./Command";
import log from "../helpers/logger";

export default class Commands {
  private _commands: Command[] = []

  constructor(commands: Command[]) {
    log('\nListening to Commands', commands.map(cmd => cmd.name))

    commands.map(command => this.add(command))
  }

  public add(command: Command): void {
    this._commands.push(command)
  }

  public run(msg: Message): void {
    this._commands.map(cmd => cmd.run(msg))
  }
}