import { actionBehaviour } from "../../../types"
import { Requirements } from '../../classes/Requirements'
import Action from '../../classes/Action'
import Commands from '../../classes/Commands'
import client from '../../../setup'
import { sql } from '../../../database/db';
import { GuildActive } from '../../../database/models/GuildActive';
import { RichEmbedOptions } from 'discord.js';

const requirements: Requirements = {
    text: false,
    params: {
        limit: false,
    }
}

const description = 'Lists the most active users using the average time between messages'

const action: actionBehaviour = async req => {
    const { id: guild_id } = req.msg.guild
    const { limit } = req.params

    const users = await GuildActive.findAll({
        where: {
            guild_id,
            messageAvg: { [sql.Op.gt]: limit || 10 }
        },
        attributes: ['messageAvg', 'user_id', 'lastMessage'],
        limit: 5,
        order: [['messageAvg', 'ASC']]
    })

    const usersNames = await Promise.all(users.map(async u => {
        const { username, tag } = await client.fetchUser(u.user_id)
        const lastMessage = new Date(u.lastMessage).toJSON().slice(0, 10).split('-').reverse().join('/')

        return {
            lastMessage,
            username,
            tag,
            avg: u.messageAvg
        }
    }))

    const embed: RichEmbedOptions = {
        title: 'Leaderboard',
        fields: usersNames.map((u, i) => {
            return {
                name: `#${i + 1} - ${u.tag} @ ${u.lastMessage}`,
                value: `${u.avg} seconds between messages`
            }
        })
    }


    req.msg.channel.send('Current most active users are...', { embed })
}

const def = new Action(requirements, action, description)
Commands.add('leaderboard', def)
