import Command from "../classes/Command"
import SmallActions from './smallActions'
import noPrefix from './noPrefix';
import log from "../helpers/logger";
import audits from './actions/averageAudits';
import urban from './actions/urban';
import define from './actions/define';
import google from './actions/google';
import imgur from './actions/imgur';
import currency from './actions/currency';
import translator from './actions/translator';
import help from './actions/help';


// Defaults = { text: true, ats: false, prefix: true, params: undefined }
const Declarations: Command[] =
  [
    new Command('debug', SmallActions.debug),
    new Command('say', SmallActions.say),
    new Command('thonkwot', SmallActions.thonkwot),
    new Command('image', SmallActions.image),
    new Command('mom gay', noPrefix.momgay),
    new Command('audits', audits),
    new Command('urban', urban),
    new Command('define', define),
    new Command('google', google),
    new Command('imgur', imgur),
    new Command('curr', currency),
    new Command('tl', translator),
    new Command('help', help),
  ]

export default Declarations

export function logDeclarations() {
  const text = `\nListening to Commands:\n${Declarations.map(cmd => cmd.name).join('\n')}`
  log(text)
}