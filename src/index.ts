/**
 * @ref https://github.com/discord/discord-interactions-js/blob/main/examples/gcloud_function.js
 */
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions'
import { Response } from 'express'
import dotenv from 'dotenv'
dotenv.config()

const CLIENT_PUBLIC_KEY = process.env.CLIENT_PUBLIC_KEY

export const main = async (req: any, res: Response) => {
  if(!CLIENT_PUBLIC_KEY) {
    return res.status(401).send('invalid request signature')
  }

  const sig = req.get('x-signature-ed25519')
  const time = req.get('x-signature-timestamp')

  if(!sig || !time) {
    return res.status(401).send('invalid request signature')
  }

  const isValid = await verifyKey(req.rawBody, sig, time, CLIENT_PUBLIC_KEY)

  if (!isValid) {
    return res.status(401).send('invalid request signature')
  }

  const interaction = req.body
  if(interaction && interaction.type === InteractionType.APPLICATION_COMMAND) {
    res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `${interaction.data.name}コマンド用アプリです`
      },
    })
  } else {
    res.send({
      type: InteractionResponseType.PONG,
    })
  }
  return res.status(401).send('invalid request signature')
}
