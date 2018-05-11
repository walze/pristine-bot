import { Requirements } from './Requirements';
import { actionType } from '../types';


export default class Act {
  public required: Requirements

  constructor(
    requirements: Requirements,
    public action: actionType,
    public description: string = '',
  ) {
    this.required = new Requirements(requirements)
  }
}