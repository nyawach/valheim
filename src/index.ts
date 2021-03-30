/**
 * @ref https://github.com/discord/discord-interactions-js/blob/main/examples/gcloud_function.js
 */
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions'
import { Response } from 'express'
// @ts-ignore
import Compute from '@google-cloud/compute'
import dotenv from 'dotenv'
dotenv.config()

const CLIENT_PUBLIC_KEY = process.env.CLIENT_PUBLIC_KEY

const compute = new Compute()
const zone = compute.zone('asia-northeast1-a')
const vm = zone.vm('valheim')


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
    const option = interaction.data.options[0]
    if(!option) {
      return res.status(401).send('invalid request signature')
    }
    switch(option.name) {
      case 'status':
      break
      case 'stop':
        await vm.stop()
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Valheimサーバーを停止してます... :loading:`
          },
        })
      case 'start':
        await vm.start()
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Valheimサーバーを起動しています。数分後にアクセスしてみてください。`
          },
        })
      default:
      break
    }
  } else {
    return res.send({
      type: InteractionResponseType.PONG,
    })
  }
  return res.status(401).send('invalid request signature')
}
