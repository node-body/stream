/* eslint-env mocha */

'use strict'

const assert = require('assert')
const assertRejects = require('assert-rejects')
const errorHandler = require('api-error-handler')
const express = require('express')
const got = require('got')
const zlib = require('zlib')

const getBodyStream = require('./')

describe('Stream body parser', () => {
  let app, server

  before((done) => {
    app = express()

    app.post('/', (req, res, next) => {
      const body = getBodyStream(req)

      body.pipe(res)
    })

    app.post('/inflate', (req, res, next) => {
      const body = getBodyStream(req, { inflate: true })

      body.pipe(res)
    })

    app.use(errorHandler())

    server = app.listen(26934, () => done())
  })

  after((done) => {
    server.close(done)
  })

  it('should handle no content-encoding', () => {
    const body = 'test string 1'

    return got('http://localhost:26934/', { body }).then((res) => {
      assert.strictEqual(res.statusCode, 200)
      assert.strictEqual(res.body, body)
    })
  })

  it('should handle "identity" content-encoding', () => {
    const body = 'test string 2'
    const headers = { 'Content-Encoding': 'identity' }

    return got('http://localhost:26934/', { body, headers }).then((res) => {
      assert.strictEqual(res.statusCode, 200)
      assert.strictEqual(res.body, body)
    })
  })

  it('should handle "deflate" content-encoding', () => {
    const body = 'test string 3'
    const encoded = zlib.deflateSync(body)
    const headers = { 'Content-Encoding': 'deflate' }

    return got('http://localhost:26934/inflate', { body: encoded, headers }).then((res) => {
      assert.strictEqual(res.statusCode, 200)
      assert.strictEqual(res.body, body)
    })
  })

  it('should handle "gzip" content-encoding', () => {
    const body = 'test string 4'
    const encoded = zlib.gzipSync(body)
    const headers = { 'Content-Encoding': 'gzip' }

    return got('http://localhost:26934/inflate', { body: encoded, headers }).then((res) => {
      assert.strictEqual(res.statusCode, 200)
      assert.strictEqual(res.body, body)
    })
  })

  it('should reject "deflate" content-encoding', () => {
    const body = 'test string 5'
    const encoded = zlib.deflateSync(body)
    const headers = { 'Content-Encoding': 'deflate' }

    return assertRejects(
      got('http://localhost:26934/', { body: encoded, headers }),
      (err) => (err.statusCode === 415 && JSON.parse(err.response.body).code === 'UNSUPPORTED_ENCODING')
    )
  })

  it('should reject "gzip" content-encoding', () => {
    const body = 'test string 6'
    const encoded = zlib.gzipSync(body)
    const headers = { 'Content-Encoding': 'gzip' }

    return assertRejects(
      got('http://localhost:26934/', { body: encoded, headers }),
      (err) => (err.statusCode === 415 && JSON.parse(err.response.body).code === 'UNSUPPORTED_ENCODING')
    )
  })
})
