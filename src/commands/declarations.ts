import Command from "../classes/Command"
import SmallActions from './smallActions'
import noPrefix from './noPrefix';
import log from "../helpers/logger";
import {
  auditsAction,
  translatorAction,
  urbanAction,
  defineAction,
  googleAction,
  currencyAction,
  imgurAction
} from './actions';

const Declarations: Command[] =
  [
    new Command('debug', SmallActions.debug, { text: false, ats: false, prefix: false }),
    new Command('say', SmallActions.say),
    new Command('thonkwot', SmallActions.thonkwot, { text: false }),
    new Command('image', SmallActions.image),
    new Command('mom gay', noPrefix.momgay, { prefix: false, text: false }),
    new Command('audits', auditsAction, { ats: true }),
    new Command('urban', urbanAction),
    new Command('define', defineAction),
    new Command('google', googleAction),
    new Command('imgur', imgurAction),
    new Command('curr', currencyAction),
    new Command('tl', translatorAction),
  ]

export default Declarations

export function logDeclarations() {
  const text = `\nListening to Commands:\n${Declarations.map(cmd => cmd.name).join('\n')}`
  log(text)
}