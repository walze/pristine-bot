// import { Message } from 'discord.js'

import { Good as GoodWords } from '../balance/good'
import { Bad as BadWords } from '../balance/bad'
import CommandRequest from '../../bot/classes/CommandRequest'
import { User, IUserModel } from '../models/User';

/**
 * Checks good and bad words on a string, user gets money of it's good and loses if it's bad
 *
 * @export
 * @class WordsMod
 */
export default class WordsMod {

  /**
   * Gets wallet
   */
  public static getWallet(username: string, discriminator: string) {
    return new Promise<IUserModel | null>((res, rej) =>
      User.findOne({
        where: { username, discriminator },
      })
        .then(res)
        .catch(rej),
    )
  }

  public readonly text: string = ''
  public readonly result: { good?: string, bad?: string } = {}
  public readonly shouldEmit: boolean = false
  public interval = 5000

  private request: () => CommandRequest

  /**
   * Creates an instance of WordsMod.
   */
  constructor(request: CommandRequest) {
    // Did it this way so i won't have the 1k lines property on console
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

  /**
   * Replies and saves to DB
   */
  public emit() {
    if (!this.shouldEmit) return

    // this._reply()
    this._saveDB()
  }

  /**
   * Replies to author of they said a good or bad word
   */
  // private _reply() {
  //   this.request().msg.channel.send(this.text).then(message => {
  //     let singleMessage = message as Message

  //     if (Array.isArray(message))
  //       singleMessage = message[0]

  //     setTimeout(() => singleMessage.delete(), this.interval)
  //   })
  // }

  /**
   * creates or updates User on DB
   */
  private async _saveDB() {
    const { username, discriminator } = this.request().msg.author

    const user = await User.findOne({
      where: { username, discriminator },
    })

    if (!user) {
      this._newEntry(username, discriminator)
      return
    }

    User.update(
      {
        balance: this.result.good ? user.balance += 50 : user.balance += -50,
        goods: this.result.good ? ++user.goods : user.goods,
        bads: this.result.bad ? ++user.bads : user.bads,
      },
      { where: { id: user.id as number } },
    )
      .then(() => console.log(`Updated User: ${username}#${discriminator}`))
  }

  /**
   * creates new entry on DB
   */
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

  /**
   * Finds good and bad words
   */
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
