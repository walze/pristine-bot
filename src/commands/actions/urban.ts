import Axios, { AxiosError } from "axios";
import log from "../../helpers/logger";
import { urban, action } from "../../types";


export const urbanAction: action = (request) => {
  Axios.get(`http://urbanscraper.herokuapp.com/search/${request.text}`)
    .then(res => {
      const urbanResponse: urban[] = res.data.slice(0, request.params.amount || 2)

      if (urbanResponse) {

        const embed = {
          embed: {
            author: {
              name: request.msg.author.username,
              icon_url: request.msg.author.avatarURL
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

        request.msg.channel.send(embed)
      } else request.msg.reply('404\'d')
    })
    .catch((err: AxiosError) => {
      log(err.response, err.message)

      request.msg.channel.send(`Not Found
${err.message}`)
    })
}