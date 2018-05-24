import { Requirements } from "../../classes/Requirements";
import { actionFunction } from '../../types';
import Action from '../../classes/Act';
import { isArray } from 'util';



const cleverbot = require('cleverbot.io')
var bot = new cleverbot('Vo42zXO1zvSwkeis', 'f0QvprQvbAhrOFE4SdJPT3UAVhkXg6bJ')
bot.setNick('Blyad');



const requirements: Requirements = {

}

const description = 'Talk with me :3'

const action: actionFunction = async req => {
  return await req.msg.channel.send('*typing...*').then(afterTyping => {

    bot.create((err: any, session: any) => {

      bot.ask(req.text, (err: any, response: any) => {
        if (isArray(afterTyping)) afterTyping = afterTyping[0]
        afterTyping.delete()

        req.msg.channel.send(response)
      });
    });
  })
}


const talk = new Action(requirements, action, description)
export default talk