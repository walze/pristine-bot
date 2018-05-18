import { Requirements } from './Requirements';
import { actionType } from '../types';


export default class Act {
  public readonly required: Requirements

  constructor(
    reqment: Requirements,
    public readonly action: actionType,
    public readonly description: string = '*none*',
  ) {
    if (!this.description) throw new Error('Description property cannot be empty')

    this.required = new Requirements(reqment)
  }
}