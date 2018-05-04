import { Message } from "discord.js"
import Parameters from "./Parameters"
import { action } from "../types"
import { checkIfCommand } from "../decorators/checkIfCommand"

export default class Command {
  constructor(
    public name: string,
    private _action: action<any>
  ) { }

  @checkIfCommand
  public run(msg: Message): void {
    this._action(msg, new Parameters(msg))
  }
}