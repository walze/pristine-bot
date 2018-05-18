import Act from '../../classes/Act';

const dm = new Act(
  { ats: true },
  req => {
    req.msg.client.fetchUser(req.ats[0].id)
      .then(user => {
        user.send(`Message from @${req.msg.author.tag} "${req.text}"`)
        req.msg.delete()
      })
  },
  'DMs someone')

export default dm
