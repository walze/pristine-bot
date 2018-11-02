import Sequelize from 'sequelize';
import { sql } from '../db';

interface IUserModel {
    id?: number;
    goods: number;
    bads: number;
    username: string;
    discriminator: string;
    balance: number;
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
})
