import Sequelize from 'sequelize';
import { sql } from '../db';
import { IWordModResult } from '../classes/WordsMod';

export interface IUserModel {
    id: string;
    goods: number;
    bads: number;
    balance: number;
    messageAvg: number;
    lastMessage: string;
    totalMessages: number;
}

export const User = sql.define<IUserModel, IUserModel>('user', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    goods: Sequelize.BIGINT,
    bads: Sequelize.BIGINT,
    balance: Sequelize.BIGINT,
    messageAvg: Sequelize.FLOAT,
    lastMessage: Sequelize.DATE,
    totalMessages: Sequelize.BIGINT,
})

/**
 * creates new entry on DB
 */
export const newUser = async (
    id: string,
    result: IWordModResult = {},
) => {
    console.log(`Creating User: ${id}`)

    return await User.create({
        id,
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
    id: string,
    result: IWordModResult = {},
) => {
    const user = await User.findOne({ where: { id } })

    if (!user) {
        await newUser(id, result)
        return
    }

    return user
}
