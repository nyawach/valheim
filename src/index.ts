import * as DiscordJS from 'discord.js'

import dotenv from 'dotenv'
import { Request } from 'express'
import { Response } from 'express'

dotenv.config()

export const main = (req: Request, res: Response) => {
  console.log(req, process.env)
  const client = new DiscordJS.Client()
  
  client.on('ready', async () => {
    console.log('the bot is ready')
  })

  res.status(200)
  res.send({message: 'Hello'})
}
