import { Map } from 'immutable';
import { ICommand, getCommand, changeCommand } from '../command';
import { Actions } from './enum';

let actions = Map<Actions, IAction>();

export const createAction = (
  name: Actions,
  description: string,
  action: <T>() => Promise<T> | void,
) => {
  actions = actions.set(name, { name, description, action })
}

export const runAction = (command: ICommand): ICommand => {
  const { action: name, promises = [] } = getCommand(command)
  if (!name) return command;

  const action = actions.get(Actions[name])
  if (!action) return command;

  const promise = action.action() || new Promise(rs => rs())

  return changeCommand(command, {
    promises: [...promises, promise],
  })
}

interface IAction {
  name: Actions,
  description: string,
  action: <T>() => Promise<T> | void
}
