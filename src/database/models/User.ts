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
    lastMessage: Sequelize.DATE,
    totalMessages: Sequelize.BIGINT,
})

/**
 * creates new entry on DB
 */
export async function newUser(
    username: string,
    discriminator: string,
    result: IWordModResult,
) {

    console.log(`Creating User: ${username}#${discriminator}`)

    return await User.create({
        username,
        discriminator,
        balance: result.good ? 50 : -50,
        goods: result.good ? 1 : 0,
        bads: result.bad ? 1 : 0,
        lastMessage: new Date().toISOString(),
        totalMessages: 1,
    })
}
