import Action from '../../classes/Action';
import Commands from '../../classes/Commands';

const dm = new Action(
  { ats: true },
  async req => {
    const user = await req.msg.client.fetchUser(req.at(0).id);

    user.send(`Message from @${req.msg.author.tag} "${req.text}"`);

    req.msg.delete();
  },
  'DMs someone',
)

Commands.add('dm', dm)
