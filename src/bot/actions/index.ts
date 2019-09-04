import { Map } from 'immutable';
import { ICommand, getCommand } from '../command';
import { Actions } from './helpers/enum';

let actions = Map<Actions, IAction>();

export const createAction = (
  name: Actions,
  description: string,
  action: ActionFn,
) => {
  actions = actions.set(name, { name, description, action })
}

export const runAction = (command: ICommand) => {
  const { action: name } = getCommand(command)
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
