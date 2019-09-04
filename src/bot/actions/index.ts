import { Map } from 'immutable';
import { ICommand } from '../command';
import { Actions } from './helpers/enum';

let actions = Map<Actions, IAction>();

export const createAction = (
  name: Actions,
  description: string,
  action: ActionFn,
) => {
  actions = actions.set(name, { name, description, action })
}

export const validadeAction = (command: ICommand) => {

}

export const runAction = (command: ICommand) => {
  const { action: name } = command
  if (!name) return command;

  const action = actions.get(Actions[name])
  if (!action) return command;

  return action.action(command);
}

interface IAction {
  name: Actions,
  description: string,
  action: ActionFn
}

export type ActionFn = (command: ICommand) => Promise<ICommand>
