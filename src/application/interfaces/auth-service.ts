import { Either } from '@domain/utils/either'

export type Payload = {
  id: string
}

export interface AuthService {
  sign: <T extends Payload>(payload: T) => string
  verify: (token: string) => Either<Error, object & Payload>
}
