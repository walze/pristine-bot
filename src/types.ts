import Parameters from "./classes/Parameters";
import { Message } from "discord.js";

// used for global types

export type action<T = Parameters> = (message: Message, parameters: Parameters & T) =>
  void | Promise<Message | Message[]>

export interface at {
  id: string,
  tag: string
}

export interface urban {
  id: string
  term: string
  url: string
  definition: string
  example: string
  author: string
  author_url: string
  posted: string
}

export interface definition {
  meta: {
    synsetOffset: number,
    lexFilenum: number,
    synsetType: string,
    wordCount: number,
    words: object[],
    pointerCount: number,
    pointers: object[]
  },
  glossary: string
}