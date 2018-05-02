import { Message } from "discord.js";
import Axios from "axios";
import log from "../../helpers/logger";
import { urban } from "../../types";
import Parameters from "../../classes/Parameters";


export default function urbanAction(msg: Message, params: Parameters) {
  Axios.get(`http://urbanscraper.herokuapp.com/search/${params.text}`)
    .then(res => {
      const urbanResponse: urban[] = res.data.slice(0, params.defs || 2)

      if (urbanResponse) {

        const text = urbanResponse.map((resp, i) =>
          `__**Definition #${i + 1}**__
${resp.definition}

*Example*
${resp.example}

`)

        msg.channel.send(text.join('\n'))
      } else msg.reply('404\'d')
    })
    .catch(log)
}