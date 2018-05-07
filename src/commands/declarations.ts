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

const Declarations = [
  new Command('debug', SmallActions.debug),
  new Command('say', SmallActions.say),
  new Command('thonkwot', SmallActions.thonkwot),
  new Command('image', SmallActions.image),
  new Command('help', msg => msg.channel.send(Commands.list())),
  new Command('audits', auditsAction),
  new Command('tl', translatorAction),
  new Command('urban', urbanAction),
  new Command('define', defineAction),
  new Command('google', googleAction),
  new Command('mafs', SmallActions.mafs),
  new Command('curr', currencyAction)
]

export default Declarations
