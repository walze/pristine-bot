import { actionFunction } from '../../types';
import CommandRequest from './Request';
import { Requirements } from './Requirements';

/**
 * Holds a command's functionality, description and requirements.
 *
 * @export
 * @class Action
 */
export default class Action {
  public readonly required: Requirements

  /**
   * Creates an instance of Action.
   * @param {Requirements} requirements
   * @param {actionFunction} _action
   * @param {string} [description='*none*']
   * @memberof Action
   */
  constructor(
    requirements: Requirements,
    private readonly _action: actionFunction,
    public readonly description: string = '*none*',
  ) {
    if (!this.description)
      throw new Error('Description property cannot be empty')

    this.required = new Requirements(requirements)
  }

  public run(req: CommandRequest) {
    const ran = this._action(req)

    if (!(ran instanceof Promise)) {
      console.error('Action returned', ran)
      throw new Error(`Action returned ${ran} instead of Promise`)
    } else return ran
  }
}
