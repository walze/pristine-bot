import { Requirements } from './Requirements';
import { actionType } from '../types';


export default class Action {
  public readonly required: Requirements

  constructor(
    reqment: Requirements,
    public readonly run: actionType,
    public readonly description: string = '*none*',
  ) {
    if (!this.description) throw new Error('Description property cannot be empty')

    this.required = new Requirements(reqment)
  }
}