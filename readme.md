# Stream body parser

Gives a stream of an incoming http request, optionally with content decoded in respect to the `Content-Encoding` header.

## Installation

```sh
npm install --save @body/stream
```

## Usage

```js
const getBodyStream = require('@body/stream')

// ...

app.post('/v1/users', (req, res, next) => {
  const body = getBodyStream(req)

  body.pipe(/* ... */)
})

// ...
```

## API

### `getBodyStream(req: Request, options?: Options): ReadableStream`

Read the body of the incoming request `req`. Returns a readable stream of the data.

If the body isn't encoded, the incoming request `req` will be returned as is.

#### Options

##### `inflate` (boolean)

When set to `true`, then bodies with a `deflate` or `gzip` content-encoding will be inflated.

Defaults to `false`.
