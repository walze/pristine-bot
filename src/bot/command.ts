import { Message, MessageOptions, RichEmbed, Attachment } from 'discord.js'

import { Map } from 'immutable'
import { Actions } from './actions/helpers/enum';

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

export const changeCommand = (
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
  message: Message
  action?: keyof typeof Actions,
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
