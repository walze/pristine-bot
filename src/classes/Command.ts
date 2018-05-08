import CommandRequest from "./CommandRequest"
import { action } from "../types"
import log from "../helpers/logger";
import Commands from "./CommandsEventEmmiter";

export default class Command {
  constructor(
    public name: string,
    private _action: action<any>
  ) {
    Commands.on(this.name, request => {
      this._run(request)
      log(`Ran command "${request.command}"`)
    })

  }

  private _run(req: CommandRequest): void {

    const result = this._action(req)

    if (result instanceof Promise)
      result
        .then(log)
        .catch(log)
  }
}