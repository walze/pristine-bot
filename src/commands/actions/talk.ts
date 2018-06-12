import { Requirements } from "../../classes/Requirements";
import { actionFunction } from '../../types';
import Action from '../../classes/Act';
import { isArray } from 'util';
import Commands from '../../classes/Commands';



const cleverbot = require('cleverbot.io')
var bot = new cleverbot('Vo42zXO1zvSwkeis', 'f0QvprQvbAhrOFE4SdJPT3UAVhkXg6bJ')
bot.setNick('Blyad');



const requirements: Requirements = {

}

const description = 'Talk with me :3'

const action: actionFunction = async req => {
  return await new Promise((res) => {

    req.msg.channel.send('*typing...*').then(async afterTyping => {
      bot.create(async (err: any, session: any) => {
        bot.ask(req.text, async (err: any, response: any) => {

          if (isArray(afterTyping)) afterTyping = afterTyping[0]

          afterTyping.delete().then(async () => {
            res(req.msg.reply(response))
          })

        })
      })
    })

  })
}


const talk = new Action(requirements, action, description)

Commands.add('talk', talk)