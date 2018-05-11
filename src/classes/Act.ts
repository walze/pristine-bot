import { Requirements } from './Requirements';
import { actionType } from '../types';


export default class Act {
  public required: Requirements

  constructor(
    requirements: Requirements,
    public action: actionType,
    public description: string = 'None',
  ) {
    this.required = new Requirements(requirements)
  }
}