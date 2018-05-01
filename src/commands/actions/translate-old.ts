const translate = require('google-translate-api')
const langs = require('./langs')
const options = { to: 'en' }
const { prefix } = require('../config.json')

module.exports = function (command, message) {
  // remove from:
  let text = command

  if (command.indexOf('from:') >= 0)
    text = command.replace(
      command.slice(
        command.indexOf('from:')
      ).split(' ')[0] + ' ', ''
    )

  // remove to:
  text = text.replace(text.slice(text.indexOf('to:')).split(' ')[0] + ' ', '')
  // remove ,tl
  text = text.replace(`${prefix}tl `, '')

  if (command.indexOf('to:') >= 0) {
    this.toCmd = command.slice(command.indexOf('to:')).split(' ')[0].replace('to:', '')
    options.to = findLang(toCmd)
  } else options.to = 'en'


  if (command.indexOf('from:') >= 0) {
    this.fromCmd = command.slice(command.indexOf('from:')).split(' ')[0].replace('from:', '')
    options.from = findLang(fromCmd)
  } else options.from = 'auto'

  translate(text, options).then(res => {
    message.channel.send(`From: ${langs[res.from.language.iso]}`)
    message.channel.send(`To: ${langs[options.to]}`)

    message.channel.send(`${res.text}`)
  }).catch(err => {
    console.error(err)
    message.channel.send(`An error occurred, ${err}`)
  })
}


function findLang(txt) {
  txt = txt[0].toUpperCase() + txt.slice(1);
  for (let prop in langs)
    if (langs[prop] == txt)
      return prop
}