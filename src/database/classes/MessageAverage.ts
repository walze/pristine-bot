import { Message } from 'discord.js'
import { findOrCreate, IUserModel, User } from '../models/User'
import { date_diff } from '../../bot/helpers/date_diff'

// average formula, oldAvg + ((newValue - oldAvg) / totalSize)

export class MessageAverage {

  public static formula = (
    oldAvg: number,
    newValue: number,
    totalSize: number,
  ) => {
    return oldAvg + ((newValue - oldAvg) / totalSize)
  }

  private _user: Promise<IUserModel | undefined>

  constructor(msg: Message) {
    const { id } = msg.author
    this._user = findOrCreate(id)

    this._calculate()
  }

  private async _calculate() {
    const user = await this._user
    if (!user) return

    const newTime = new Date()
    const oldTime = new Date(user.lastMessage)
    const newValue = date_diff(oldTime.getTime(), newTime.getTime())

    const newAvg = MessageAverage.formula(user.messageAvg, newValue, user.totalMessages + 1)

    console.log('Time between last message:', `${newValue} seconds`)
    console.log('New Average:', newAvg)
    console.log(`${user.id}\n`)

    const updateData = {
      lastMessage: newTime.toISOString(),
      totalMessages: ++user.totalMessages,
      messageAvg: newAvg,
    }

    const where = { id: user.id }

    User.update(updateData, { where })
  }
}
