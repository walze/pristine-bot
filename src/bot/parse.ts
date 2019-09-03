import { changeCommand, ICommand, getCommand } from './command';

export interface IArgs {
  match?: RegExpMatchArray,
  key?: string,
  value?: string,
}

const filterArgs = (
  acc: IArgs[],
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

export const parseCommand = (command: ICommand) => {
  const { message: { content } } = getCommand(command)

  const [pristine, action, ...split] = content
    .split(/\s+/)

  if (pristine.toLowerCase().trim() !== 'pristine,') return command;

  const args = split
    .reduce(filterArgs, [] as IArgs[])

  const userMessage = args
    .filter(arg => arg.key === 'message')
    .map(arg => arg.value)
    .join(' ')

  return changeCommand(command, { content: userMessage, action })
}
