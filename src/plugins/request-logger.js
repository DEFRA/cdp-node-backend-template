import hapiPino from 'hapi-pino'

import { logDestination, loggerOptions } from './logger-options.js'

export const requestLogger = {
  plugin: hapiPino,
  options: {
    ...loggerOptions,
    stream: logDestination
  }
}
