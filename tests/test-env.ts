import { createHash } from 'crypto'

process.env.JWT_SECRET = createHash('sha1').update(Date.now().toString()).digest('hex')
