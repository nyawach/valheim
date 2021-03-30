import * as DiscordJS from 'discord.js'

import dotenv from 'dotenv'

dotenv.config()

const client = new DiscordJS.Client()

client.on('ready', async () => {
  console.log('the bot is ready')
})