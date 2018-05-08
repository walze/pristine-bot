import CommandRequest from "./CommandRequest"
import { action } from "../types"
import log from "../helpers/logger";
import { Commands } from "./Commands";

export default class Command {
  constructor(
    public name: string,
    private _action: action<any>
  ) {
    Commands.on(this.name, (req: CommandRequest) => {
      this._run(req)
      log(`Running event ${req.command}`)
    })

  }

  private _run(request: CommandRequest): void {

    const result = this._action(request)

    if (result instanceof Promise)
      result
        .then(log)
        .catch(log)
  }
}