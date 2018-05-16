import { Requirements } from './Requirements';
import { actionType } from '../types';


export default class Act {
  public required: Requirements

  constructor(
    readonly requirements: Requirements,
    public readonly action: actionType,
    public readonly description: string = 'None',
  ) {
    if (!this.description) throw new Error('Description property cannot be empty')

    this.required = new Requirements(requirements)
  }
}