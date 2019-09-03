import { ICommand, getCommand, changeCommand } from './command';

export const replyMessage = (
  command: ICommand,
) => {
  const { message, content, messageSendOptions, promises = [] } = getCommand(command)
  if (!content) return command;

  const promise = message.channel
    .send(content, messageSendOptions)

  return changeCommand(
    command, {
      promises: [...promises, promise],
    },
  )
}
