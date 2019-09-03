import { changeCommand, ICommand, getCommand } from './command';
import { Map } from 'immutable';
import { Actions } from './actions/helpers/enum';

export interface IArgument {
  match?: RegExpMatchArray,
  key?: string,
  value?: string,
}

const filterArgs = (
  acc: IArgument[],
  string: string,
  index: number,
  array: string[],
) => {
  const arg = string.match(/--(\w+)/)

  if (arg) {
    const [, key] = arg
    const value = array[index + 1]

    return [
      ...acc,
      { match: arg, key, value },
    ]
  }

  const previous = acc[index - 1]

  if ((previous && previous.match) || arg) {
    delete acc[index - 1].match
    return [...acc]
  }

  return [
    ...acc,
    { key: 'message', value: string },
  ]
}

const filterMessage = (args: IArgument[]) => args
  .filter(arg => arg.key === 'message')
  .map(arg => arg.value)
  .join(' ')

const filterFlags = (args: IArgument[]) => args
  .filter(arg => arg.key !== 'message')
  .reduce(
    (acc, arg) => {
      if (!arg.key || !arg.value) return acc;

      return { ...acc, [arg.key]: arg.value }
    },
    {} as { [key: string]: string },
  )

export const parseCommand = (command: ICommand) => {
  const { message: { content } } = getCommand(command)

  const [
    pristine,
    action,
    ...split
  ] = content
    .split(/\s+/)

  if (pristine.toLowerCase().trim() !== 'pristine,') return command;

  const args = split.reduce(filterArgs, [] as IArgument[])
  const userMessage = filterMessage(args)
  const flags = Map(filterFlags(args))

  // console.log(args)

  return changeCommand(
    command,
    {
      content: userMessage,
      action: action as keyof typeof Actions,
      flags,
    },
  )
}
