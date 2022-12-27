import type { ListEventsByDateUseCase } from '@application/useCases/list-events-by-date/list-events-by-date'
import type { ListEventsByDateValidator } from '@application/useCases/list-events-by-date/list-events-by-date-validator'
import { InvalidRangeDateParamsError } from '@infra/http/errors/invalid-range-date-params'

import { ok, badRequest } from '@infra/http/helpers/http-helper'

type ListEventsByDateController = Controller<{
  listEventsByDateSchema: ListEventsByDateValidator
  listEventsByDateUseCase: ListEventsByDateUseCase
}>

export const listEventsByDateControllerFactory: ListEventsByDateController = ({
  listEventsByDateSchema,
  listEventsByDateUseCase
}) => {
  return async (req) => {
    const dateParams = listEventsByDateSchema.safeParse(req.query)
    if (!dateParams.success) {
      return badRequest(new InvalidRangeDateParamsError())
    }

    const eventsByDate = await listEventsByDateUseCase(dateParams.data)
    return ok(eventsByDate)
  }
}
