import { ICommand, commandError, mutateCommand } from '../command'
import { Actions } from './helpers/enum'
import { IIndexedAny } from '../helpers/types'

let actions = new Map<Actions, IAction<any>>()

export const createAction = <T>(
  name: Actions,
  description: string,
  params: T,
  action: ActionFn<T>,
) => {
  actions = actions.set(name, { name, description, action, params })
}

export const validadeAction = (command: ICommand) => {
  const { flags, actionName } = command

  if (!actionName) return command

  const action = actions.get(Actions[actionName])
  if (!action) return command

  for (const key in action.params) if (action.params.hasOwnProperty(key)) {
    const keyIsRequired = action.params[key]

    if (!flags) throw commandError(command, `expected ${key} but did not find any flags`)

    if (keyIsRequired && !flags[key])
      throw commandError(command, `expected flag "${key}" but was not given`)
  }

  return mutateCommand(command, { action })
}

export const runAction = (command: ICommand) => {
  const { action } = command
  if (!action) return command

  return action.action(command)
}

export interface IAction<T = IIndexedAny> {
  name: Actions,
  description: string,
  params: T,
  action: ActionFn<T>
}

export type ActionFn<T = IIndexedAny> = (command: ICommand<T>) => Promise<ICommand<T>>
