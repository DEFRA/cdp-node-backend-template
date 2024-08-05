import { health } from '~/src/api/health/index.js'
import { example } from '~/src/api/example/index.js'

/**
 * @satisfies {ServerRegisterPluginObject<void>}
 */
const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])

      // Application specific routes, add your own routes here.
      await server.register([example])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */

export { router }
