import {
  exampleFindOneController,
  exampleFindAllController
} from '~/src/api/example/controllers/index.js'

/**
 * @satisfies {ServerRegisterPluginObject<void>}
 */
const example = {
  plugin: {
    name: 'example',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/example',
          ...exampleFindAllController
        },
        {
          method: 'GET',
          path: '/example/{exampleId}',
          ...exampleFindOneController
        }
      ])
    }
  }
}

export { example }

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
