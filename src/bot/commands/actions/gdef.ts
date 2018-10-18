import { Requirements } from "../../classes/Requirements";
import { actionBehaviour } from '../../../types';
import Action from '../../classes/Action';
import Axios from 'axios';
import { JSDOM } from 'jsdom';
import Commands from '../../classes/Commands';

const requirements: Requirements = {
  params: {
    amount: false,
  },
}

const description = 'Give you the google definition of a word'

const action: actionBehaviour = async req =>
  Axios.get(`https://www.google.com.br/search?q=${req.text}+meaning`)
    .then(async res => {
      const dom = new JSDOM(res.data, {
        contentType: "text/html",
        includeNodeLocations: true,
      })
      const doc = dom.window.document

      const nounsLIs = doc.querySelectorAll('#ires > ol > div:nth-child(1) > div > table:nth-child(2) > tbody > tr:nth-child(1) > td > ol li')
      const verbsLIs = doc.querySelectorAll('#ires > ol > div:nth-child(1) > div > table:nth-child(2) > tbody > tr:nth-child(2) > td > ol li')

      const nouns: string[] = []
      const verbs: string[] = []

      if (nounsLIs) nounsLIs.forEach((el: any) => nouns.push(el.innerHTML))
      if (verbsLIs) verbsLIs.forEach((el: any) => verbs.push(el.innerHTML))

      const all = nouns.concat(verbs)

      const embed = {
        embed: {
          author: {
            name: req.msg.author.username,
            icon_url: req.msg.author.avatarURL,
          },
          title: "Google definitions on " + req.text,
          fields: all.map((def, i) =>
            ({
              name: `#${i + 1}`,
              value: def,
            })),
          timestamp: new Date(),
        },
      }

      if (all.length < 1) throw new Error('Not Found 404\'d')

      return req.msg.channel.send(embed)
    })

const gdef = new Action(requirements, action, description)
Commands.add('gdef', gdef)
