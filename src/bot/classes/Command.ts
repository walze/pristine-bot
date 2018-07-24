import Action from './Action'
import Commands from "./Commands"
import CommandRequest from "./Request"
import log from "../helpers/logger"
import { mapObj } from '../helpers/obj_array'
import { isArray } from 'util'

/**
 *
 *
 * @export
 * @class Command
 */
export default class Command {

  /**
   * Creates an instance of Command.
   * @param {string} name What the user will have to type to trigger
   * @param {Action} action What command will do and some information about it
   * @memberof Command
   */
  constructor(public name: string, public action: Action) {

    Commands.event.on(this.name, (req: CommandRequest) => {

      log(`|| running "${req.msg.author.username}'s" command "${req.command}" at "${req.msg.guild.name}"...`)

      this._checkRequirements(req)
      this._run(req)
    })
  }

  /**
   * Runs action
   *
   * @private
   * @param {CommandRequest} req
   * @returns
   * @memberof Command
   */
  private async _run(req: CommandRequest) {
    // Sends loading message, it's deleted after run
    return await req.msg.channel.send('*processing... >//<*')
      .then(async loading => {
        // waits from action to run
        const result = await this.action.run(req)

        if (isArray(loading)) loading[0].delete()
        else loading.delete()

        return result
      })
  }

  /**
   * Checks action requirements. Throws error if misses any requirements
   *
   * @private
   * @param {CommandRequest} req
   * @memberof Command
   */
  private _checkRequirements(req: CommandRequest) {
    let errorString = ''

    if (this.action.required.prefix === req.hasPrefix) {
      if ((this.action.required.text !== (req.text !== '')) && this.action.required.text)
        errorString += '\nThis command requires some text'
      if ((this.action.required.ats !== (req.ats.length > 0)) && this.action.required.ats)
        errorString += '\nThis command requires @someone'

      mapObj(this.action.required.params, (required, prop) => {
        if (!req.params[prop] && required)
          errorString += `\nArgument "${prop}" is required for this command`
      })

      if (errorString === '') return

      throw new Error(errorString)
    }

    throw new Error('Prefix required and wasn\'t given')
  }
}
