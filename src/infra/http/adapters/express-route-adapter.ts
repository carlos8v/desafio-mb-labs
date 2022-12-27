import type { Request, Response } from 'express'
type ControllerFunction = ReturnType<Controller<any>>

export const expressRouteAdapter = (controller: ControllerFunction) => {
  return async (req: Request, res: Response) => {
    try {
      const response = await controller(req)
      if (response.error) {
        return res.status(response.statusCode).json({
          status: response.statusCode,
          error: response.data?.name,
          message: response.data?.message || 'Unexpected Error',
        })
      }

      return res.status(response.statusCode).json(response.data)
    } catch (error: Error | any) {
      console.error(error)
      return res.status(500).json({
        status: 500,
        error: error?.message || 'Internal server error'
      })
    }
  }
}
