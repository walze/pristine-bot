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
  imgurAction,
  translatorReqs,
  currencyReqs,
  imgurReqs,
  googleReqs,
  defineReqs,
  auditsReqs
} from './actions';


// Defaults = { text: true, ats: false, prefix: true, params: undefined }
const Declarations: Command[] =
  [
    new Command('debug', SmallActions.debug),
    new Command('say', SmallActions.say),
    new Command('thonkwot', SmallActions.thonkwot),
    new Command('image', SmallActions.image),
    new Command('mom gay', noPrefix.momgay),
    new Command('audits', auditsAction, auditsReqs),
    new Command('urban', urbanAction),
    new Command('define', defineAction, defineReqs),
    new Command('google', googleAction, googleReqs),
    new Command('imgur', imgurAction, imgurReqs),
    new Command('curr', currencyAction, currencyReqs),
    new Command('tl', translatorAction, translatorReqs),
  ]

export default Declarations

export function logDeclarations() {
  const text = `\nListening to Commands:\n${Declarations.map(cmd => cmd.name).join('\n')}`
  log(text)
}