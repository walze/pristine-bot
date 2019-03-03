import { Guild } from './models/Guild'
import { User } from './models/User'
import { GuildActive } from './models/GuildActive'
import { Iquery } from "./db"


const sync = async () => {
    const a = await Guild.sync()
    const b = await User.sync()
    const c = await GuildActive.sync()

    return [a, b, c]
}

export const reset = () => {
    Iquery
        .dropAllTables()
        .then(() => console.log('DB Reseted'))
        .then(async () => await sync())
        .then(() => console.log('DB Synced'))
}

sync()