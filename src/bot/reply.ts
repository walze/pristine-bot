import { ICommand, getCommandJSON } from './newCommand';

export const replyMessage = (
  command: ICommand,
) => {
  const { message, content, messageSendOptions } = getCommandJSON(command)

  return message.channel
    .send(content, messageSendOptions)
}
