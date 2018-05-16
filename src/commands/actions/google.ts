import { JSDOM } from 'jsdom';
import Axios from 'axios';
import { actionType } from '../../types';
import { Requirements } from '../../classes/Requirements';
import Act from '../../classes/Act';

const requirements: Requirements = {
  params: {
    amount: false
  }
}

const description = 'Googles some text'

const action: actionType = async req => {
  return await Axios.get(`https://www.google.com.br/search?q=${req.text}`)
    .then(async res => {
      const dom = new JSDOM(res.data, {
        contentType: "text/html",
        includeNodeLocations: true
      })
      const doc = dom.window.document
      const linksOriginal = Array.from(doc.querySelectorAll('.g .r a')).map((el) => el.getAttribute('href') || '')

      // bypass codes
      let links = linksOriginal.map(lk =>
        lk.replace(/\/url\?q=/g, '')
          .replace(/&sa=.+/g, '')
          .replace(/%3D/g, '=')
          .replace(/%3F/g, '?')
          .replace(/%26/g, '&')
      )

      // remove images search
      links = links.filter(el => el.indexOf('/search') === -1)

      // slice by amount
      links = links.slice(0, Number(req.params.amount) || 1)

      const text = links.map(lk => `${lk}\n`)

      return await req.msg.channel.send(text)
    })
}

const google = new Act(requirements, action, description)
export default google