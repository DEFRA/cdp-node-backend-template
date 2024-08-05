import tls from 'node:tls'

import { getTrustStoreCerts } from '~/src/helpers/secure-context/get-trust-store-certs.js'

/**
 * @satisfies {ServerRegisterPluginObject<void>}
 */

const secureContext = {
  plugin: {
    name: 'secure-context',
    register(server) {
      const originalCreateSecureContext = tls.createSecureContext

      tls.createSecureContext = function (options = {}) {
        const trustStoreCerts = getTrustStoreCerts(process.env)

        if (!trustStoreCerts.length) {
          server.logger.info('Could not find any TRUSTSTORE_ certificates')
        }

        const secureContext = originalCreateSecureContext(options)

        trustStoreCerts.forEach((cert) => {
          // eslint-disable-next-line -- Node.js API not documented
          secureContext.context.addCACert(cert)
        })

        return secureContext
      }

      server.decorate('server', 'secureContext', tls.createSecureContext, {
        apply: true
      })
    }
  }
}

export { secureContext }

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
