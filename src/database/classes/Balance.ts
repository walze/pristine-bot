import { Good as GoodWords } from '../balance/good';
import { Bad as BadWords } from '../balance/bad';
import { Message } from 'discord.js';
import { isArray } from 'util';

export class GoodOrBad {

  public readonly text: string = ''
  public readonly result: {
    good: string | undefined;
    bad: string | undefined;
  } | null = null
  public readonly shouldEmit: boolean = false
  public interval = 10000

  constructor(text: string) {
    if (!text) return

    this.result = this._find(text)

    if (this.result.good && this.result.bad) return

    if (this.result.good)
      this.text += `+50$ for being nice. Word: ***${this.result.good.toUpperCase()}*** ! c:\n`

    if (this.result.bad)
      this.text += `-50$ for being a meanie. Word: ***${this.result.bad.toUpperCase()}*** ! :c\n`

    if (this.result.good || this.result.bad)
      this.shouldEmit = true
  }

  public emit(msg: Message) {
    if (this.shouldEmit)
      msg.reply(this.text)
        .then(message => {
          let singleMessage = message as Message

          if (isArray(message)) singleMessage = message[0]

          setTimeout(() => singleMessage.delete(), this.interval)
        })
  }

  private _find(text: string) {
    const words = text.split(' ')

    const foundGood = words.find(word =>
      GoodWords.some(good => new RegExp(`^${good}$`, 'i').test(word)),
    )

    const foundBad = words.find(word =>
      BadWords.some(bad => new RegExp(`^${bad}$`, 'i').test(word)),
    )

    return {
      good: foundGood,
      bad: foundBad,
    }
  }
}
