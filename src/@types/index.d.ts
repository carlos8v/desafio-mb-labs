declare global {
  type UseCase<Constructor, Request, Response> = (_: Constructor) => (_: Request) => Response
}

export {}
