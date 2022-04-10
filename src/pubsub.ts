import { PubSub } from '@google-cloud/pubsub'

const TOPIC_NAME = process.env.TOPIC_NAME || 'valheim'

const pubSubClient = new PubSub()

export const publishMessage = async (commandType: string) => {
  try {
    const topic = await pubSubClient.topic(TOPIC_NAME)
    const messageId = await topic.publishMessage({
        data: Buffer.from(JSON.stringify({ commandType })),
    })
    console.log(`Message ${messageId} published.`)
  } catch (error) {
    const e = error as Error
    console.error(`[commandType: ${commandType}] Received error while publishing: ${e.message}`)
    process.exitCode = 1
  }
}
