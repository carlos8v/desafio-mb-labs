import type { Request } from 'express'
import type { HttpHelper } from '@infra/http/helpers/httpHelper'

declare global {
  type UseCase<Constructor, Req, Res> = (c: Constructor) => (r: Req) => Res
  type Controller<Constructor> = (_: Constructor) => (req: Request) => Promise<HttpHelper> | HttpHelper
}

export {}
