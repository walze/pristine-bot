import { mutateCommand, ICommand } from './command';
import { Map } from 'immutable';
import { Actions } from './actions/helpers/enum';
import matchAll from 'string.prototype.matchall'

export interface IArgument {
  match?: RegExpMatchArray,
  key?: string,
  value?: string,
}

const flagRegex = /--(\w+)[=\s]?(\w+)?/g

const filterFlags = (args: IArgument[]) => args
  .reduce(
    (acc, arg) => {
      if (!arg.key || !arg.value) return acc;

      return { ...acc, [arg.key]: arg.value }
    },
    {} as { [key: string]: string },
  )

export const parseCommand = (command: ICommand) => {
  const { message: { content } } = command

  const [
    pristine,
    action,
    ...split
  ] = content
    .split(/\s+/)

  if (pristine.toLowerCase().trim() !== 'pristine,') return command;

  const joined = split.join(' ')

  const args = [...matchAll(joined, flagRegex)].map(([, key, value]) => ({ key, value }))
  const userMessage = joined.replace(flagRegex, '')
  const flags = Map(filterFlags(args))

  return mutateCommand(
    command,
    {
      content: userMessage,
      action: action as keyof typeof Actions,
      flags,
    },
  )
}
