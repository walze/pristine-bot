import { Requirements } from "../../classes/Requirements";
import { actionType } from '../../types';
import Act from '../../classes/Act';
import Axios from 'axios';
import { JSDOM } from 'jsdom';


const requirements: Requirements = {

}

const description = 'Give you the google definition of a word'

const action: actionType = async req => {
  return await Axios.get(`https://www.google.com.br/search?q=${req.text}+meaning`)
    .then(res => {
      const dom = new JSDOM(res.data, {
        contentType: "text/html",
        includeNodeLocations: true
      })
      const doc = dom.window.document

      const nounsLIs = doc.querySelectorAll('#ires > ol > div:nth-child(1) > div > table:nth-child(2) > tbody > tr:nth-child(1) > td > ol li')
      const verbsLIs = doc.querySelectorAll('#ires > ol > div:nth-child(1) > div > table:nth-child(2) > tbody > tr:nth-child(2) > td > ol li')

      const nouns: string[] = []
      const verbs: string[] = []

      if (nounsLIs) nounsLIs.forEach(el => nouns.push(el.innerHTML))
      if (verbsLIs) verbsLIs.forEach(el => verbs.push(el.innerHTML))

      const embedNouns = {
        embed: {
          author: {
            name: req.msg.author.username,
            icon_url: req.msg.author.avatarURL
          },
          title: "Noun definitions of " + req.text,
          fields: nouns.map((noun, i) => {
            return {
              name: `#${i + 1}`,
              value: noun
            }
          }),
          timestamp: new Date()
        }
      }

      const embedVerbs = {
        embed: {
          author: {
            name: req.msg.author.username,
            icon_url: req.msg.author.avatarURL
          },
          title: "Verb definitions of " + req.text,
          fields: verbs.map((verb, i) => {
            return {
              name: `#${i + 1}`,
              value: verb
            }
          }),
          timestamp: new Date()
        }
      }

      if (nouns.length > 0)
        req.msg.channel.send(embedNouns)
      if (verbs.length > 0)
        req.msg.channel.send(embedVerbs)

      if (nouns.length < 1 && verbs.length < 1) {
        throw new Error('Not Found 404\'d')
      }
    })
}


const googleDef = new Act(requirements, action, description)

export default googleDef