import { Message, MessageOptions, RichEmbed, Attachment } from 'discord.js';
import { Map } from 'immutable'

interface ICommandNoIter {
  readonly message: Message;
  content?: string,
  messageSendOptions?: MessageOptions | RichEmbed | Attachment,
}

export interface ICommandInitial extends ICommandNoIter {
  [Symbol.iterator](): Iterator<[keyof ICommandNoIter, ICommandNoIter[keyof ICommandNoIter]]>
}

export type ICommand = {
  [key in keyof ReturnType<newCommand>]: ReturnType<newCommand>[key];
};

export type newCommand = typeof newCommand

export const newCommand = (obj: ICommandNoIter) => {
  const object: ICommandInitial = {
    ...obj,
    *[Symbol.iterator]() {
      const properties = Object.keys(this) as Array<keyof ICommandNoIter>;
      for (const key of properties) {
        const value = this[key] as ICommandNoIter[keyof ICommandNoIter];

        yield [key, value];
      }
    },
  }

  return Map<keyof ICommandNoIter, ICommandNoIter[keyof ICommandNoIter]>(object)
}

export const changeCommand = (
  command: ICommand,
  changes: Partial<ICommandNoIter>,
): ReturnType<newCommand> => {
  const object = {
    ...getCommandJSON(command),
    ...changes,
  } as ICommandInitial

  return Map(object)
}
export const getCommandJSON = (command: ICommand) => command.toJSON() as unknown as ICommandNoIter
