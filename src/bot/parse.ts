import { changeCommand, ICommand, getCommand } from './command';
import { Map } from 'immutable';
import { Actions } from './actions/enum';

export interface IArgument {
  match?: RegExpMatchArray,
  key?: string,
  value?: string,
}

const filterArgs = (
  acc: IArgument[],
  string: string,
  index: number,
) => {
  const arg = string.match(/--(\w+)/)

  if (arg) {
    const [, key] = arg

    return [
      ...acc,
      { match: arg, key },
    ]
  }

  const previous = acc[index - 1]

  // previous
  if (previous && previous.match) {
    previous.value = string
    delete previous.match

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

  return changeCommand(
    command,
    {
      content: userMessage,
      action: action as keyof typeof Actions,
      flags,
    },
  )
}
