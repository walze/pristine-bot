import Axios, { AxiosError } from "axios";
import log from "../../helpers/logger";
import { urban, action } from "../../types";


export const urbanAction: action = (msg, params) => {
  Axios.get(`http://urbanscraper.herokuapp.com/search/${params.text}`)
    .then(res => {
      const urbanResponse: urban[] = res.data.slice(0, params.amount || 2)

      if (urbanResponse) {

        const embed = {
          embed: {
            author: {
              name: msg.author.username,
              icon_url: msg.author.avatarURL
            },
            title: "Urban Definitions",
            fields: urbanResponse.map((def, i) => {
              return {
                name: `Definition #${i + 1}`,
                value: def.definition + `\n__**Example**__\n${def.example}`
              }
            }),
            timestamp: new Date()
          }
        }

        msg.channel.send(embed)
      } else msg.reply('404\'d')
    })
    .catch((err: AxiosError) => {
      log(err.response, err.message)

      msg.channel.send(`Not Found
${err.message}`)
    })
}