import { ICommand, commandError } from '../command';
import { Actions } from './helpers/enum';
import { IIndexedAny } from '../helpers/types';

let actions = new Map<Actions, IAction<any>>();

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
  const {
    params,
    flags,
  } = command
  const required = params as { [key: string]: any }

  for (const key in required) if (required.hasOwnProperty(key)) {
    const keyIsRequired = required[key];
    if (!flags && keyIsRequired)
      throw commandError(command, `expected ${key} but no flags given`)
    if (!flags) throw commandError(command, `expected ${key} but no flags given`);

    if (keyIsRequired && !flags[key])
      throw commandError(command, `expected ${key} but no flag given`)
  }

  return command
}

export const runAction = (command: ICommand) => {
  const { actionName: name } = command
  if (!name) return command;

  const action = actions.get(Actions[name])
  if (!action) return command;

  return action.action(command);
}

interface IAction<T = IIndexedAny> {
  name: Actions,
  description: string,
  params: T,
  action: ActionFn<T>
}

export type ActionFn<T = IIndexedAny> = (command: ICommand<T>) => Promise<ICommand<T>>
