import Commands from "../classes/Commands"
import Command from "../classes/Command"
import { auditsAction } from "./actions/averageAudits"
import { translatorAction } from "./actions/translator"
import { urbanAction } from "./actions/urban"
import { defineAction } from "./actions/define"
import { googleAction } from "./actions/google"
import { currencyAction } from "./actions/currency"
import SmallActions from './smallActions'

// s-debug argument-value
// Eg. s-debug event-MEMBER_ADD_BAN amount-5 @wiva#9996
// params.argument will equals to value

export const debug = new Command('debug', SmallActions.debug)
export const say = new Command('say', SmallActions.say)
export const thonkwot = new Command('thonkwot', SmallActions.thonkwot)
export const image = new Command('image', SmallActions.image)
export const help = new Command('help', msg => msg.channel.send(Commands.list()))
export const audits = new Command('audits', auditsAction)
export const tl = new Command('tl', translatorAction)
export const urban = new Command('urban', urbanAction)
export const define = new Command('define', defineAction)
export const google = new Command('google', googleAction)
export const mafs = new Command('mafs', SmallActions.mafs)
export const curr = new Command('curr', currencyAction)
