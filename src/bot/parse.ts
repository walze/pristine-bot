import { changeCommand, ICommand, getCommand } from './command';

export interface IArgs {
  type: string,
}

export const parseCommand = (command: ICommand) => {
  const { message: { content } } = getCommand(command)

  const [pristine, ...split] = content
    .split(/\s+/)

  if (pristine.toLowerCase().trim() !== 'pristine,') return command;

  return changeCommand(command, { content: 'lolno' })
}
