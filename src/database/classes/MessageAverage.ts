import { Message } from 'discord.js'
import { findOrCreateUser, IUserModel, User } from '../models/User'
import { date_diff } from '../../bot/helpers/date_diff'
import { IGuildActive, findOrCreateGuildAC, GuildActive } from '../models/GuildActive'
import { IGuildsModel } from '../models/Guild'
import { findOrCreateGuild } from './../models/Guild'



export class MessageAverage {
  /**
   * average formula
   */
  public static formula = (
    oldAvg: number,
    newValue: number,
    totalSize: number,
  ) => {
    const total = totalSize > 10 ? totalSize / 10 : totalSize

    return oldAvg + ((newValue - oldAvg) / total)
  }

  private _user: Promise<IUserModel>
  private _guild: Promise<IGuildsModel>
  private _guildAC: Promise<IGuildActive>

  constructor(msg: Message) {
    const { id: guild_id } = msg.guild
    const { id } = msg.author

    this._user = findOrCreateUser(id)
    this._guild = findOrCreateGuild(guild_id)
    this._guildAC = findOrCreateGuildAC(id, guild_id)

    this._updateAvg(id, guild_id)
  }

  private async _updateAvg(user_id: string, guild_id: string) {
    const newTimeUser = await MessageAverage.calculate(await this._user)
    const newTimeGuild = await MessageAverage.calculate(await this._guildAC)

    if (await this._guild) {
      GuildActive.update(newTimeGuild, {
        where: { user_id, guild_id }
      })

      User.update(newTimeUser, { where: { id: user_id } })
    } else {
      console.error('ERROR, NO GUILD')
    }
  }

  public static calculate = async (instance: IUserModel | IGuildActive) => {
    const newTime = new Date()
    const oldTime = new Date(instance.lastMessage)
    const newValue = date_diff(oldTime.getTime(), newTime.getTime())

    const newAvgUser = MessageAverage.formula(instance.messageAvg, newValue, instance.totalMessages + 1)

    console.log('Time between last message:', `${newValue} seconds`)
    console.log('New Average:', newAvgUser)

    const updateData = {
      lastMessage: newTime.toISOString(),
      totalMessages: ++instance.totalMessages,
      messageAvg: newAvgUser,
    }

    return updateData
  }
}
