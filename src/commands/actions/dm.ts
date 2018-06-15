import Action from '../../classes/Action';
import Commands from '../../classes/Commands';

const dm = new Action(
  { ats: true },
  req => {
    return req.msg.client.fetchUser(req.ats[0].id)
      .then(user => {
        user.send(`Message from @${req.msg.author.tag} "${req.text}"`)
        req.msg.delete()
      })
  },
  'DMs someone')

Commands.add('dm', dm)