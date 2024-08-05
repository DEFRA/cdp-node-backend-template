import { URL } from 'node:url'
import { HttpsProxyAgent } from 'https-proxy-agent'

import { config } from '~/src/config/index.js'

/**
 * HTTP Agent setup using the injected CDP Proxy Config
 * @returns {{agent: HttpsProxyAgent<string>, url: URL}|null}
 */
const proxyAgent = () => {
  const proxy = config.get('httpsProxy') ?? config.get('httpProxy')

  if (!proxy) {
    return null
  } else {
    const proxyUrl = new URL(proxy)
    return {
      url: proxyUrl,
      agent: new HttpsProxyAgent(proxyUrl)
    }
  }
}

export { proxyAgent }
