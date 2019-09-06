import { Message, MessageOptions, RichEmbed, Attachment } from 'discord.js'

import { Actions } from './actions/helpers/enum'
import { IIndexedAny } from './helpers/types'
import { IAction } from './actions'

export const commandError = <T>(command: ICommand<T>, errorMessage: string) =>
  mutateCommand(command, { error: new Error(errorMessage) })

export const makeCommand = <T = IIndexedAny>(obj: ICommand<T>) => Object.freeze(obj)

export const mutateCommand = <T>(
  command: ICommand<T>,
  changes: Partial<ICommand<T>>,
) => makeCommand({ ...command, ...changes })

// _____ //
// _____ //
// TYPES //
// _____ //
// _____ //
export interface ICommand<T = IIndexedAny> {
  message: Message
  error?: Error
  isCommand?: boolean
  action?: IAction
  actionName?: keyof typeof Actions
  content?: string
  flags?: { [key in keyof T]: string }
  promises?: Array<PromiseLike<any>>
  messageSendOptions?: MessageOptions | RichEmbed | Attachment
}
