import { ICommand, mutateCommand } from './command';

export const replyMessage = async (
  commandPromise: ICommand | Promise<ICommand>,
) => {
  const command = await commandPromise

  const { message, content, messageSendOptions, promises = [] } = command
  if (!content) return command;

  const promise = message.channel
    .send(content, messageSendOptions)

  return mutateCommand(
    command, {
      promises: [...promises, promise],
    },
  )
}
