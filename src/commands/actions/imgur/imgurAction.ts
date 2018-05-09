import { action, imgurResponse } from '../../../types';
import Axios from 'axios';
import { log } from 'console';

const config = {
  "client_id": "bebb4e6140bcb51",
  "secret": "d1d0d99626c94aa6f740842a02365769178a1cc7"
}

export const imgurAction: action = async req => {
  return await
    Axios
      .get(`https://api.imgur.com/3/gallery/search/?q=${req.text}`, {
        headers: { Authorization: `Client-ID ${config.client_id}` }
      })
      .then(res => {
        const resp: imgurResponse[] = res.data.data
        log(resp[0].title, resp[0].images)

        req.msg.channel.send(resp[0].images[0].link)
      })

}
