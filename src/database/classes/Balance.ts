import { Good as GoodWords } from '../balance/good'
import { Bad as BadWords } from '../balance/bad'
import { Message } from 'discord.js'
import { isArray } from 'util'
import { User } from '../db'
import Request from '../../bot/classes/Request';
import ReplyError from '../../bot/helpers/ReplyError';

export default class GoodOrBad {

  public static getWallet(username: string, discriminator: string): PromiseLike<any> {
    return User.find({
      where: {
        username,
        discriminator,
      },
    })
  }

  public readonly text: string = ''
  public readonly result: {
    good: string | undefined,
    bad: string | undefined,
  } | null = null
  public readonly shouldEmit: boolean = false
  public money = 0
  public interval = 2000
  private request: () => Request

  constructor(request: Request) {
    this.request = () => request

    const text = this.request().msg.content

    if (!text) return

    this.result = this._find(text)

    if (this.result.good && this.result.bad) return

    if (this.result.good)
      this.text += `Just gave 50$ to ***${this.request().msg.author.username}*** for being positive`

    if (this.result.bad)
      this.text += `Just stole 50$ from ***${this.request().msg.author.username}*** for being negative`

    if (this.result.good || this.result.bad)
      this.shouldEmit = true
  }

  public emit() {
    if (!this.shouldEmit) return

    try {
      this._reply()
      this._saveDB()
    } catch (err) {
      ReplyError(this.request(), err)
    }
  }

  private _reply() {
    this.request().msg.channel.send(this.text).then(message => {
      let singleMessage = message as Message

      if (isArray(message))
        singleMessage = message[0]

      setTimeout(() => singleMessage.delete(), this.interval)
    })
  }

  private async _saveDB() {
    const username = this.request().msg.author.username
    const discriminator = this.request().msg.author.discriminator

    const res: any = await User.find({
      where: { username, discriminator },
    })

    if (!res) return this._newEntry(username, discriminator)

    const { dataValues } = res as any

    User.update({
      balance: this.result!.good ? dataValues.balance += 50 : dataValues.balance += -50,
      goods: this.result!.good ? ++dataValues.goods : dataValues.goods,
      bads: this.result!.bad ? ++dataValues.bads : dataValues.bads,
    },
      { where: { id: dataValues.id } },
    ).then(() => console.log(`Updated User: ${username}#${discriminator}`))
  }

  private async _newEntry(username: string, discriminator: string) {

    console.log(`Creating User: ${username}#${discriminator}`)

    return await User.create({
      username,
      discriminator,
      balance: this.result!.good ? 50 : -50,
      goods: this.result!.good ? 1 : 0,
      bads: this.result!.bad ? 1 : 0,
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
