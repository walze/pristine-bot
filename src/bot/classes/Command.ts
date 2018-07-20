import Action from './Action';
import Commands from "./Commands";
import { Performances } from './Performances';
import Request from "./Request";
import log from "../helpers/logger";
import { mapObj } from '../helpers/obj_array';
import { isArray } from 'util';
import ErrorHandler from '../helpers/ErrorHandler';

export default class Command {

  constructor(public name: string, public action: Action) {

    Commands.event.on(this.name, (req: Request) => {
      log(`|| running "${req.msg.author.username}'s" command "${req.command}" at "${req.msg.guild.name}"...`)
      try {
        this._checkRequirements(req)
        this._run(req)
      } catch (e) {
        ErrorHandler(req, e)
      }

    })

  }

  private async _run(req: Request) {
    return await req.msg.channel.send('*loading your request... >//<*')
      .then(async loading => {
        try {
          const result = await this.action.run(req)

          if (isArray(loading)) loading[0].delete()
          else loading.delete()

          Performances.find('command').end()
          return result
        } catch (err) {
          return ErrorHandler(req, err)
        }
      })
  }

  private _checkRequirements(req: Request): void {
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
