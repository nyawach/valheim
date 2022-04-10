import compute from '@google-cloud/compute'

/**
 * @see https://github.com/googleapis/nodejs-compute/blob/main/samples/startInstance.js
 */
export const start = async (
  projectId: string,
  zone: string,
  instanceName: string,
) => {
    const instancesClient = new compute.InstancesClient()

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
    const instancesClient = new compute.InstancesClient()

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
    const instancesClient = new compute.InstancesClient()

    const [ instance ] = await instancesClient.get({
      project: projectId,
      zone,
      instance: instanceName,
    })

    return instance.status
}
