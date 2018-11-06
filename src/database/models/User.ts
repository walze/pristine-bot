import Sequelize from 'sequelize';
import { sql } from '../db';
import { IWordModResult } from '../classes/WordsMod';

export interface IUserModel {
    id?: number;
    goods: number;
    bads: number;
    username: string;
    discriminator: string;
    balance: number;
    messageAvg: number;
    lastMessage: string;
    totalMessages: number;
}

export const User = sql.define<IUserModel, IUserModel>('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    goods: Sequelize.BIGINT,
    bads: Sequelize.BIGINT,
    username: Sequelize.STRING,
    discriminator: Sequelize.STRING,
    balance: Sequelize.BIGINT,
    messageAvg: Sequelize.FLOAT,
    lastMessage: Sequelize.DATE,
    totalMessages: Sequelize.BIGINT,
})

/**
 * creates new entry on DB
 */
export const newUser = async (
    username: string,
    discriminator: string,
    result: IWordModResult = {},
) => {
    console.log(`Creating User: ${username}#${discriminator}`)

    return await User.create({
        username,
        discriminator,
        balance: 0,
        goods: result.good ? 1 : 0,
        bads: result.bad ? 1 : 0,
        messageAvg: 0,
        lastMessage: new Date().toISOString(),
        totalMessages: 1,
    })
}

/**
 * Returns user of found, undefined if not
 */
export const findOrCreate = async (
    username: string,
    discriminator: string,
    result: IWordModResult = {},
) => {
    const user = await User.findOne({
        where: { username, discriminator },
    })

    if (!user) {
        await newUser(username, discriminator, result)
        return
    }

    return user
}
