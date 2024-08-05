/**
 *
 * @param { import('@hapi/hapi').Request } request
 * @param { import('@hapi/hapi').ResponseToolkit } h
 * @param { Error|undefined } error
 * @returns { never }
 */
export function failAction(request, h, error) {
  if (error) {
    request.logger.error(error, error.message)
    throw error
  }
  throw new Error('Server error')
}
