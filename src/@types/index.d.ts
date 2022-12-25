import type { Request, Response } from 'express'

declare global {
  type UseCase<Constructor, Req, Res> = (c: Constructor) => (r: Req) => Res
  type Controller<Constructor> = (_: Constructor) => (req: Request, res: Response) => Promise<any> | any
}

export {}
