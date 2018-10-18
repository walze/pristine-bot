import Action from './Action'
import CommandRequest from "./Request"
import log from "../helpers/logger"
import { mapObj } from '../helpers/obj_array'

export default class Command extends Action {

  /**
   * Creates an instance of Command.
   * @param  name What the user will have to type to trigger
   * @param  action What command will do and some information about it
   */
  public constructor(public name: string, action: Action) {
    super(action.required, action.behaviour, action.description)
  }

  /**
   * Runs Command
   *
   */
  public run(req: CommandRequest) {
    log(`|| running "${req.msg.author.username}'s" command "${req.command}" at "${req.msg.guild.name}"...`)

    this._checkRequirements(req)

    return this._run(req)
  }

  /**
   * Runs action
   *
   */
  private async _run(req: CommandRequest) {
    // waits from action to run
    const result = await this.runAction(req)

    return result
  }

  /**
   * Checks action requirements. Throws error if misses any requirements
   *
   */
  private _checkRequirements(req: CommandRequest) {
    let errorString = ''

    if (this.required.prefix === req.hasPrefix) {
      if ((this.required.text !== (req.text !== '')) && this.required.text)
        errorString += '\nThis command requires some text'
      if ((this.required.ats !== (req.ats.length > 0)) && this.required.ats)
        errorString += '\nThis command requires @someone'

      mapObj(this.required.params, (required, prop) => {
        if (!req.params[prop] && required)
          errorString += `\nArgument "${prop}" is required for this command`
      })

      if (errorString === '') return

      throw new Error(errorString)
    }

    throw new Error('Prefix required and wasn\'t given')
  }
}
