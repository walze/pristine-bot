import Action from '../../classes/Act';
import Commands from '../../classes/Commands';

export const dm = new Action(
  { ats: true },
  req => {
    req.msg.client.fetchUser(req.ats[0].id)
      .then(user => {
        user.send(`Message from @${req.msg.author.tag} "${req.text}"`)
        req.msg.delete()
      })
  },
  'DMs someone')

Commands.add('dm', dm)