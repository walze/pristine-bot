import { Message, MessageOptions, RichEmbed, Attachment } from 'discord.js'

import { Map } from 'immutable'
import { Actions } from './actions/helpers/enum';
import { IIndexAny } from './helpers/types';

export const commandError = <T>(command: ICommand<T>, errorMessage: string) =>
  mutateCommand(command, { error: new Error(errorMessage) });

export const makeCommand = <T = IIndexAny>(obj: Partial<ICommand<T>>) => {
  const object = {
    ...obj,
    *[Symbol.iterator]() {
      const properties = Object.keys(this) as Array<keyof ICommand<T>>

      for (const key of properties) yield [key, this[key]]
    },
  }

  return Map<keyof ICommand<T>, ICommand<T>[keyof ICommand<T>]>(object as ICommand<T>)
    .toJSON() as unknown as ICommand<T>
}

export const mutateCommand = <T>(
  command: ICommand<T>,
  changes: Partial<ICommand<T>>,
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
export interface ICommand<T = IIndexAny> {
  message: Message
  error?: Error
  isCommand?: boolean
  actionName?: keyof typeof Actions
  content?: string
  flags?: Map<keyof T, string>
  params: T
  promises?: Array<PromiseLike<any>>
  messageSendOptions?: MessageOptions | RichEmbed | Attachment
  [Symbol.iterator](): Iterator<[keyof ICommand, ICommand[keyof ICommand]]>
}

export type makeCommand = typeof makeCommand
