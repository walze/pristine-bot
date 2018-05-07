import { Message } from "discord.js";
import Command from "./Command";
import Declarations from '../commands/declarations'

export default class Commands {
  private static _commands: Command[] = Declarations

  public static list(): string[] {
    return this._commands.map(cmd => cmd.name)
  }

  public static run(msg: Message): void {
    this._commands.map(cmd => cmd.run(msg))
  }
}