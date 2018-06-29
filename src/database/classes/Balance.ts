import { Good as Goods } from '../balance/good';
import { Bad as Bads } from '../balance/bad';

export class GoodOrBad {

  public text: string = ''
  public result: {
    good: string | undefined;
    bad: string | undefined;
  } | null = null
  public shouldEmit: boolean = false

  constructor(text: string) {
    if (!text) return

    this.result = this._find(text)

    if (this.result.good)
      this.text += `+50$ for the good word ${this.result.good}! c:\n`

    if (this.result.bad)
      this.text += `-50$ for the bad word ${this.result.bad}! :c\n`

    if (this.result.good || this.result.bad)
      this.shouldEmit = true
  }

  private _find(text: string) {
    const words = text.split(' ')

    const foundGood = words.find(word =>
      Goods.some(good => new RegExp(good, 'i').test(word)),
    )

    const foundBad = words.find(word =>
      Bads.some(bad => new RegExp(bad, 'i').test(word)),
    )

    return {
      good: foundGood,
      bad: foundBad,
    }
  }
}
