import { mutateCommand, ICommand } from './command';
import { Actions } from './actions/helpers/enum';
import matchAll from 'string.prototype.matchall'

import { reduce } from 'ramda'

export interface IArgument {
  key?: string,
  value?: string,
}

const flagRegex = /--(\w+)[=\s]?(\w+)?/g

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

  const args = [...matchAll(joined, flagRegex)].map(([, key, value]) => [key, value])
  const userMessage = joined.replace(flagRegex, '')
  const flags = reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {} as { [key: string]: string },
    args,
  )

  return mutateCommand(
    command,
    {
      isCommand: !!pristine,
      content: userMessage,
      actionName: action as keyof typeof Actions,
      flags,
    },
  )
}
