import { Either } from '@domain/utils/Either'

export type Payload = {
  id: string
}

export interface AuthService {
  sign: (payload: Payload) => string
  verify: (token: string) => Either<Error, string | object>
}
