/// <reference types="node" />

import { IncomingMessage } from 'http'
import { Readable } from 'stream'

declare namespace getStreamBody {
  interface Options {
    inflate?: boolean
  }
}

declare function getStreamBody (req: IncomingMessage, options?: getStreamBody.Options): Readable

export = getStreamBody
