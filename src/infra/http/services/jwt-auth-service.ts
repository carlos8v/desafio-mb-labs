import jwt from 'jsonwebtoken'
import type { AuthService } from '@application/interfaces/auth-service'

import { left, right } from '@domain/utils/either'

import { InvalidUserTokenError } from '../errors/invalid-user-token'

type AuthServiceRequest = {
  jwtSecret: string
}

export const jwtAuthServiceFactory = ({
  jwtSecret
}: AuthServiceRequest): AuthService => {
  return {
    sign: (payload) => {
      const token = jwt.sign(payload, jwtSecret, {
        subject: payload.id,
        algorithm: 'HS256'
      })

      return token
    },
    verify: (token) => {
      try {
        const payload = jwt.verify(token, jwtSecret, {
          algorithms: ['HS256']
        })
  
        if (!payload.sub || typeof payload.sub !== 'string') {
          return left(new InvalidUserTokenError())
        }

        return right({
          id: payload.sub,
          ...(typeof payload === 'string' ? {} : payload)
        })
      } catch (error) {
        return left(new InvalidUserTokenError())
      }
    }
  }
}
