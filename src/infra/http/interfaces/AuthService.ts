import { Either } from '@domain/utils/Either'

export type Payload = {
  id: string
}

export interface AuthService {
  sign: <T extends Payload>(payload: T) => string
  verify: (token: string) => Either<Error, string | object>
}
