export type HttpHelper = {
  data?: any
  error?: boolean
  statusCode: number
}

export const ok = (data: any = null): HttpHelper => ({
  data,
  statusCode: 200
})

export const created = (data: any = null): HttpHelper => ({
  data,
  statusCode: 201
})

export const badRequest = (data: any = null): HttpHelper => ({
  data,
  error: true,
  statusCode: 400
})

export const unauthorized = (data: any = null): HttpHelper => ({
  data,
  error: true,
  statusCode: 401
})

export const forbidden = (data: any = null): HttpHelper => ({
  data,
  error: true,
  statusCode: 403
})

export const notFound = (data: any = null): HttpHelper => ({
  data,
  error: true,
  statusCode: 404
})

export const unprocessableEntity = (data: any = null): HttpHelper => ({
  data,
  error: true,
  statusCode: 422
})
