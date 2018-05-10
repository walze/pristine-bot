import { action, imgurResponse } from '../../types';
import Axios from 'axios';
import { RichEmbedOptions } from 'discord.js';

const config = {
  "client_id": "bebb4e6140bcb51"
}

export const imgurAction: action = async req => {
  return await
    Axios
      .get(`https://api.imgur.com/3/gallery/search/?q=${req.text}`, {
        headers: { Authorization: `Client-ID ${config.client_id}` }
      })
      .then(async res => {
        const albums: imgurResponse[] = res.data.data

        if (albums.length < 1) throw new Error(`Nothing found on "${req.text}"`)

        const filtered = filter(albums)

        const indexes = {
          album: Number(req.params.album) - 1,
          image: Number(req.params.image) - 1
        }

        const params = {
          id: indexes.album || 0,
          image_id: indexes.image || 0,
          album: filtered[indexes.album || 0],
          image: filtered[indexes.album || 0].images[indexes.image || 0]
        }

        const embed: RichEmbedOptions = {
          author: {
            name: req.msg.author.username,
            icon_url: req.msg.author.avatarURL
          },
          title: params.album.title,
          description: params.album.description,
          image: { url: params.image },
          timestamp: new Date()
        }

        const text = `Album #${params.id + 1} out of ${filtered.length}\nImage #${params.image_id + 1} out of ${params.album.images.length} `

        return await req.msg.channel.send(text, { embed })
      })

}

function filter(albums: imgurResponse[]) {
  return albums
    .filter(album => album.images_count >= 1)
    .map(album => {
      return {
        title: album.title,
        description: album.description,
        images: album.images.map(img => img.link)
      };
    })
}