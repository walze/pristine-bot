import { changeCommand, ICommand, getCommandJSON } from './newCommand';

export interface IArgs {
  type: string,
}

export const parseCommand = (command: ICommand) => {
  const { message: { content } } = getCommandJSON(command)

  const [pristine, ...split] = content
    .split(/\s+/)

  if (pristine.trim() !== 'pristine,') return command;

  return changeCommand(command, { content: 'lolno' })
}
