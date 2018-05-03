import { Message } from "discord.js";
import Command from "./Command";
import * as declarations from '../commands/declarations'
import { objToArray } from "../helpers/obj_array";


export default class Commands {
  private static _commands: Command[] = objToArray(declarations)

  public static list(): string[] {
    return this._commands.map(cmd => cmd.name)
  }

  public static add(command: Command): void {
    this._commands.push(command)
  }

  public static run(msg: Message): void {
    this._commands.map(cmd => cmd.run(msg))
  }
}