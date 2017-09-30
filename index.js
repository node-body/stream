'use strict'

const createError = require('http-errors')
const zlib = require('zlib')

module.exports = function getBodyStream (req, options) {
  options = options || {}

  const encoding = (req.headers['content-encoding'] || 'identity').toLowerCase()

  if (encoding === 'identity') {
    return req
  }

  if (options.inflate === true && encoding === 'deflate') {
    return req.pipe(zlib.createInflate())
  }

  if (options.inflate === true && encoding === 'gzip') {
    return req.pipe(zlib.createGunzip())
  }

  throw createError(415, 'Unsupported Content Encoding', { encoding, code: 'UNSUPPORTED_ENCODING' })
}
