//import Commands from "../classes/Commands"
import Command from "../classes/Command"
import SmallActions from './smallActions'
import log from "../helpers/logger";
import { auditsAction, translatorAction, urbanAction, defineAction, googleAction, currencyAction, imgurAction } from './actions';

// s-debug argument-value
// Eg. s-debug event-MEMBER_ADD_BAN amount-5 @wiva#9996
// params.argument will equals to value

const Declarations: Command[] =
  [
    new Command('debug', SmallActions.debug),
    new Command('say', SmallActions.say),
    new Command('thonkwot', SmallActions.thonkwot),
    new Command('image', SmallActions.image),
    new Command('audits', auditsAction),
    new Command('tl', translatorAction),
    new Command('urban', urbanAction),
    new Command('define', defineAction),
    new Command('google', googleAction),
    new Command('curr', currencyAction),
    new Command('imgur', imgurAction)
  ]

export default Declarations

export function logDeclarations() {
  const text = `\nListening to Commands:\n${Declarations.map(cmd => cmd.name).join('\n')}`
  log(text)
}