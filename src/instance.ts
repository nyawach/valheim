import compute from '@google-cloud/compute'

const instancesClient = new compute.InstancesClient()

const getInstance = async (
  projectId: string,
  zone: string,
  instanceName: string,
) => {
  const [ instance ] = await instancesClient.get({
    project: projectId,
    zone,
    instance: instanceName,
  })
  return instance
}

/**
 * @see https://github.com/googleapis/nodejs-compute/blob/main/samples/startInstance.js
 */
export const start = async (
  projectId: string,
  zone: string,
  instanceName: string,
) => {

    const instance = await getInstance(
      projectId,
      zone,
      instanceName,
    )

    /**
     * @see: https://github.com/googleapis/nodejs-compute/blob/58f3ce1aecd5f2e1ba923f111c3ebde39e346a1e/samples/test/samples.test.js#L229
     */
    if (instance.status === 'RUNNING') {
      throw new Error('すでに起動中です。')
    }

    const [ response ] = await instancesClient.start({
      project: projectId,
      zone,
      instance: instanceName,
    })

    if (response.latestResponse.error) {
        throw response.latestResponse.error
    }
}

export const stop = async (
  projectId: string,
  zone: string,
  instanceName: string,
) => {

    const instance = await getInstance(
      projectId,
      zone,
      instanceName,
    )

    if (instance.status !== 'RUNNING') {
      throw new Error('停止できない状態です。')
    }

    const [ response ] = await instancesClient.stop({
      project: projectId,
      zone,
      instance: instanceName,
    })

    if (response.latestResponse.error) {
        throw response.latestResponse.error
    }
}

export const status = async (
  projectId: string,
  zone: string,
  instanceName: string,
) => {
  const instance = await getInstance(
    projectId,
    zone,
    instanceName,
  )
  return instance.status
}
