import { ICommand, getCommand } from './command';

export const replyMessage = (
  command: ICommand,
) => {
  const { message, content, messageSendOptions } = getCommand(command)

  return message.channel
    .send(content, messageSendOptions)
}
