import { Message, MessageOptions, RichEmbed, Attachment } from 'discord.js'

import { Map } from 'immutable'

export const makeCommand = (obj: ICommandNoIter) => {
  const object: ICommandInitial = {
    ...obj,
    *[Symbol.iterator]() {
      const properties = Object.keys(this) as Array<keyof ICommandInitial>

      for (const key of properties) yield [key, this[key]]
    },
  }

  return Map<keyof ICommandInitial, ICommandInitial[keyof ICommandInitial]>(object)
}

export const changeCommand = (
  command: ICommand,
  changes: Partial<ICommandNoIter>,
): ReturnType<makeCommand> => {
  const object = makeCommand({
    ...getCommand(command),
    ...changes,
  })

  return Map(object)
}

export const getCommand = (command: ICommand) => command.toJSON() as unknown as ICommandNoIter

// TYPES
interface ICommandNoIter {
  readonly message: Message

  content?: string,
  messageSendOptions?: MessageOptions | RichEmbed | Attachment,
}

interface ICommandInitial extends ICommandNoIter {
  [Symbol.iterator](): Iterator<[keyof ICommandNoIter, ICommandNoIter[keyof ICommandNoIter]]>
}

export type ICommand = {
  [key in keyof ReturnType<makeCommand>]: ReturnType<makeCommand>[key]

}

export type makeCommand = typeof makeCommand
