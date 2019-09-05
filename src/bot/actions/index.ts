import { Map } from 'immutable';
import { ICommand, commandError } from '../command';
import { Actions } from './helpers/enum';

let actions = Map<Actions, IAction<any>>();

export const createAction = <T>(
  name: Actions,
  description: string,
  params: T,
  action: ActionFn<T>,
) => {
  actions = actions.set(name, { name, description, action, params })
}

export const validadeAction = (command: ICommand) => {
  // throw commandError(command, 'test error')

  return command
}

export const runAction = (command: ICommand) => {
  const { actionName: name } = command
  if (!name) return command;

  const action = actions.get(Actions[name])
  if (!action) return command;

  return action.action(command);
}

interface IAction<T = {}> {
  name: Actions,
  description: string,
  params: T,
  action: ActionFn<T>
}

export type ActionFn<T = {}> = (command: ICommand<T>) => Promise<ICommand<T>>
