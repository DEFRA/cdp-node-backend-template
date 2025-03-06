import { pino } from 'pino'

import { loggerOptions } from '~/src/api/common/helpers/logging/logger-options.js'

const logger = pino(loggerOptions)

function createLogger() {
  return logger
}

export { createLogger }
