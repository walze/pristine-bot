import { Message } from 'discord.js'
import { findOrCreateUser, IUserModel, User } from '../models/User'
import { date_diff } from '../../bot/helpers/date_diff'
import { IGuildActive, findOrCreateGuildAC, GuildActive } from '../models/GuildActive';
import { IGuildsModel } from '../models/Guild';
import { findOrCreateGuild } from './../models/Guild';

// average formula, oldAvg + ((newValue - oldAvg) / totalSize)

export class MessageAverage {

  public static formula = (
    oldAvg: number,
    newValue: number,
    totalSize: number,
  ) => {
    return oldAvg + ((newValue - oldAvg) / totalSize)
  }

  private _user: Promise<IUserModel>
  private _guild: Promise<IGuildsModel>
  private _guildAC: Promise<IGuildActive>

  constructor(msg: Message) {
    const { id: guild_id } = msg.guild
    const { id } = msg.author
    this._user = findOrCreateUser(id)
    this._guild = findOrCreateGuild(guild_id)
    this._guildAC = findOrCreateGuildAC(guild_id)

    this._updateAvg(id, guild_id)
  }

  private async _updateAvg(id: string, guild_id: string) {
    const newTimeUser = await this._calculate(this._user)
    const newTimeGuild = await this._calculate(this._guildAC)

    if (await this._guild) {
      GuildActive.update(newTimeGuild, { where: { guild_id } })
      User.update(newTimeUser, { where: { id } })
    } else {
      console.error('ERROR, NO GUILD')
    }
  }

  private async _calculate(
    proms: Promise<IUserModel | IGuildActive>
  ) {
    const instance = await proms

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
