import jwt from 'jsonwebtoken'
import type { AuthService } from '@infra/http/interfaces/AuthService'

import { left, right } from '@domain/utils/Either'

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
  
        return right(payload)
      } catch (error) {
        return left(new InvalidUserTokenError())
      }
    }
  }
}
