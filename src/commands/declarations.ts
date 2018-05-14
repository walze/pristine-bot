import Command from "../classes/Command"
import SmallActions from './smallActions'
import noPrefix from './noPrefix';
import audits from './actions/averageAudits';
import urban from './actions/urban';
import define from './actions/define';
import google from './actions/google';
import imgur from './actions/imgur';
import currency from './actions/currency';
import translator from './actions/translator';
import help from './actions/help';
import Commands from '../classes/Commands';
import dm from './actions/dm';
import talk from './actions/talk';
import googleDef from './actions/googleDef';


Commands.declarations =
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
    new Command('dm', dm),
    new Command('talk', talk),
    new Command('googledef', googleDef)
  ]

