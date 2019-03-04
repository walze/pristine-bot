import { actionBehaviour } from "../../../types"
import { Requirements } from '../../classes/Requirements'
import Action from '../../classes/Action'
import Commands from '../../classes/Commands'
import { User } from '../../../database/models/User';
import client from '../../../setup'
import { sql } from '../../../database/db';

const requirements: Requirements = {
    text: false
}

const description = 'in constructor'

const action: actionBehaviour = async req => {
    const users = await User.findAll({
        where: {
            messageAvg: { [sql.Op.gt]: 10 }
        },
        attributes: ['messageAvg', 'id'],
        limit: 5,
        order: [['messageAvg', 'ASC']]
    })

    const usersNames = await Promise.all(users.map(async u => {
        const { username, tag } = await client.fetchUser(u.id)

        return {
            username,
            tag,
            avg: u.messageAvg
        }
    }))


    req.msg.channel.sendCode('json', JSON.stringify(usersNames))
}

const def = new Action(requirements, action, description)
Commands.add('leaderboard', def)
