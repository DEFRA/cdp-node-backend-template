import Hapi from '@hapi/hapi'

import { secureContext } from '@defra/hapi-secure-context'

import { config } from '#/config.js'
import { router } from '#/plugins/router.js'
import { requestLogger } from '#/plugins/request-logger.js'
import { mongoDb } from '#/plugins/mongodb.js'
import { failAction } from '#/common/helpers/fail-action.js'
import { pulse } from '#/plugins/pulse.js'
import { requestTracing } from '#/plugins/request-tracing.js'
import { metrics } from '@defra/cdp-metrics'

export async function createServer() {
  const server = Hapi.server({
    host: config.get('host'),
    port: config.get('port'),
    routes: {
      validate: {
        options: {
          abortEarly: false
        },
        failAction
      },
      security: {
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: false
        },
        xss: 'enabled',
        noSniff: true,
        xframe: true
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  // Hapi Plugins:
  // requestLogger  - automatically logs incoming requests
  // requestTracing - trace header logging and propagation
  // secureContext  - loads CA certificates from environment config
  // pulse          - provides shutdown handlers
  // mongoDb        - sets up mongo connection pool and attaches to `server` and `request` objects
  // router         - routes used in the app
  await server.register([
    requestLogger,
    requestTracing,
    metrics,
    secureContext,
    pulse,
    {
      plugin: mongoDb,
      options: config.get('mongo')
    },
    router
  ])

  return server
}
