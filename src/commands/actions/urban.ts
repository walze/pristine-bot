import Axios from "axios";
import { urbanResponse, actionType } from "../../types";
import Act from '../../classes/Act';
import { Requirements } from '../../classes/Requirements';

const requirements: Requirements = {}

const description = 'Searches text on Urban Dictionary'

const action: actionType = async (request) => {
  return await Axios
    .get(`http://urbanscraper.herokuapp.com/search/${request.text}`)
    .then(async res => {

      const response: urbanResponse[] = res.data.slice(0, request.params.amount || 1)

      if (response) {

        const embed = {
          embed: {
            author: {
              name: request.msg.author.username,
              icon_url: request.msg.author.avatarURL
            },
            title: "Urban Definitions",
            url: `https://www.urbandictionary.com/define.php?term=${request.text}`.replace(/\s/g, '%20'),
            description: 'Some definitions are too long for Discord, click the link to see them complete.',
            fields: fieldsSort(response),
            timestamp: new Date()
          }
        }

        return await request.msg.channel.send(embed)
      } else return await request.msg.reply('404\'d')
    })
}

const urban = new Act(requirements, action, description)
export default urban

function fieldsSort(response: urbanResponse[]) {
  const fields: object[] = []

  response.map((def, i) => {

    fields.push({
      name: `Definition #${i + 1}`,
      value: def.definition.slice(0, 1023),
      inline: true
    });

    fields.push({
      name: `*Example*`,
      value: def.example.slice(0, 1023)
    });
  });

  return fields
}
