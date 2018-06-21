import { actionFunction } from '../types';
import Request from './Request';
import { Requirements } from './Requirements';

export default class Action {
  public readonly required: Requirements

  constructor(
    reqment: Requirements,
    private readonly _action: actionFunction,
    public readonly description: string = '*none*',
  ) {
    if (!this.description)
      throw new Error('Description property cannot be empty')

    this.required = new Requirements(reqment)
  }

  public run(req: Request) {
    const ran = this._action(req)

    if (!(ran instanceof Promise)) {
      console.error('Action returned', ran)
      throw new Error(`Action returned ${ran} instead of Promise`)
    } else return ran
  }
}
