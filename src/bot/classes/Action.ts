import { actionBehaviour } from '../../types';
import CommandRequest from './Request';
import { Requirements } from './Requirements';

/**
 * Holds a command's functionality, description and requirements.
 *
 */
export default class Action {
  /**
   * What command needs to run
   *
   */
  public readonly required: Requirements

  /**
   * Creates an instance of Action.
   * @param  requirements What command needs to run
   * @param behaviour Command's run function
   * @param  [description='*none*'] What command will do
   */
  public constructor(
    requirements: Requirements,
    public readonly behaviour: actionBehaviour,
    public readonly description: string = '*none*',
  ) {
    if (!this.description) throw new Error('Description property cannot be empty')

    this.required = new Requirements(requirements)
  }

  /**
   * Runs Action behaviour
   */
  protected runAction(req: CommandRequest) {
    const ran = this.behaviour(req)

    if (!(ran instanceof Promise)) {
      console.error('Action returned', ran)
      throw new Error(`Action returned ${ran} instead of Promise`)
    }

    return ran
  }
}
