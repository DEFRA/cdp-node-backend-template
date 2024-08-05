import { pino } from 'pino'

import { loggerOptions } from '~/src/helpers/logging/logger-options.js'

function createLogger() {
  return pino(loggerOptions)
}

export { createLogger }
