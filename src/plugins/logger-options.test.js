import { beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('@defra/cdp-auditing', () => ({ setAuditDestination: vi.fn() }))

const originalLogFormat = process.env.LOG_FORMAT

beforeEach(() => {
  vi.resetModules()
  if (originalLogFormat === undefined) {
    delete process.env.LOG_FORMAT
  } else {
    process.env.LOG_FORMAT = originalLogFormat
  }
})

describe('logger destination', () => {
  test('shares one destination with the request and audit loggers when format is ecs', async () => {
    process.env.LOG_FORMAT = 'ecs'
    const { logDestination } = await import('./logger-options.js')
    const { requestLogger } = await import('./request-logger.js')
    const { setAuditDestination } = await import('@defra/cdp-auditing')

    expect(logDestination).toBeDefined()
    expect(requestLogger.options.stream).toBe(logDestination)
    expect(setAuditDestination).toHaveBeenCalledWith(logDestination)
  })

  test('does not set a destination when format is pino-pretty', async () => {
    process.env.LOG_FORMAT = 'pino-pretty'
    const { logDestination } = await import('./logger-options.js')
    const { requestLogger } = await import('./request-logger.js')
    const { setAuditDestination } = await import('@defra/cdp-auditing')

    expect(logDestination).toBeUndefined()
    expect(requestLogger.options.stream).toBeUndefined()
    expect(setAuditDestination).not.toHaveBeenCalled()
  })
})
