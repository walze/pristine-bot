import { Message, MessageOptions, RichEmbed, Attachment } from 'discord.js'

import { Map } from 'immutable'
import { Actions } from './actions/helpers/enum';

export const commandError = (command: ICommand, errorMessage: string) =>
  mutateCommand(command, { error: new Error(errorMessage) });

export const makeCommand = (obj: ICommandNoIter) => {
  const object: ICommandInitial = {
    ...obj,
    *[Symbol.iterator]() {
      const properties = Object.keys(this) as Array<keyof ICommandInitial>

      for (const key of properties) yield [key, this[key]]
    },
  }

  return Map<keyof ICommandInitial, ICommandInitial[keyof ICommandInitial]>(object)
    .toJSON() as Readonly<ICommandNoIter>
}

export const mutateCommand = (
  command: ICommand,
  changes: Partial<ICommandNoIter>,
) => makeCommand(
  {
    ...command,
    ...changes,
  },
)

// _____ //
// _____ //
// TYPES //
// _____ //
// _____ //
interface ICommandNoIter {
  message: Message,
  error?: Error,
  isCommand?: boolean,
  actionName?: keyof typeof Actions,
  content?: string,
  flags?: Map<string, string>
  promises?: Array<PromiseLike<unknown>>,
  messageSendOptions?: MessageOptions | RichEmbed | Attachment,
}

interface ICommandInitial extends ICommandNoIter {
  [Symbol.iterator](): Iterator<[keyof ICommandNoIter, ICommandNoIter[keyof ICommandNoIter]]>
}

export type ICommand = { [key in keyof ICommandNoIter]: ICommandNoIter[key] }
export type makeCommand = typeof makeCommand
