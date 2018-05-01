import * as translate from 'google-translate-api'
import { Message } from 'discord.js';
import Command from '../../classes/Command';
import log from '../../helpers/log';

/*
// API Eg.  
translate('Ik spreek Engels', {to: 'en'}).then(res => {
  console.log(res.text);
  //=> I speak English
  console.log(res.from.language.iso);
  //=> nl
}).catch(err => {
  console.error(err);
});
*/

export default function translator(msg: Message, ref: Command) {
  log(msg.content)
  log(ref)

}