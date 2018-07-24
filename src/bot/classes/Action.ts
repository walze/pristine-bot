import { actionBehaviour } from '../../types';
import CommandRequest from './Request';
import { Requirements } from './Requirements';

/**
 * Holds a command's functionality, description and requirements.
 *
 * @export
 * @class Action
 */
export default class Action {
  /**
   * What command needs to run
   *
   * @type {Requirements}
   * @memberof Action
   */
  public readonly required: Requirements

  /**
   * Creates an instance of Action.
   * @param {Requirements} requirements What command needs to run
   * @param {actionBehaviour} behaviour Command's run function
   * @param {string} [description='*none*'] What command will do
   * @memberof Action
   */
  constructor(
    requirements: Requirements,
    public readonly behaviour: actionBehaviour,
    public readonly description: string = '*none*',
  ) {
    if (!this.description) throw new Error('Description property cannot be empty')

    this.required = new Requirements(requirements)
  }

  /**
   * Runs Action behaviour
   *
   * @protected
   * @param {CommandRequest} req
   * @returns
   * @memberof Action
   */
  protected run(req: CommandRequest) {
    const ran = this.behaviour(req)

    if (!(ran instanceof Promise)) {
      console.error('Action returned', ran)
      throw new Error(`Action returned ${ran} instead of Promise`)
    }

    return ran
  }
}
