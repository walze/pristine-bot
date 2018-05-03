import { Message } from "discord.js";
import Axios, { AxiosError } from "axios";
import log from "../../helpers/logger";
import Parameters from "../../classes/Parameters";
import { dictionary } from "../../types";

export default function defineAction(msg: Message, params: Parameters) {
  Axios.get(`http://api.pearson.com/v2/dictionaries/entries?headword=${params.text}`)
    .then(res => {
      const response: dictionary = res.data

      if (response.results.length > 0) {
        const defs = response.results.slice(0, params.defs || 2)

        console.log(defs)

        let text = defs.map((def, i) => `
__*Definition #${i + 1}*__ *${def.part_of_speech}*
${def.senses.map(sense => `${sense.definition || ''}

*EXAMPLES*
${sense.examples.map(eg => `${eg.text}`)}
`)}`)


        msg.channel.send(text)
      }
      else msg.reply('404\'d')
    })
    .catch((err: AxiosError) => {
      log(err, 'define.ts')

      msg.channel.send(`__Not found or error__
${err.message}`)
    })
}