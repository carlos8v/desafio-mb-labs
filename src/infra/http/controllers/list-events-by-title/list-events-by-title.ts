import type { ListEventsByTitleValidator } from './list-events-by-title-validator'
import type { ListEventsByTitleUseCase } from '@application/useCases/list-events-by-title/list-events-by-title'

import { ok } from '@infra/http/helpers/http-helper'

type ListEventsByTitleController = Controller<{
  listEventsByTitleUseCase: ListEventsByTitleUseCase
  listEventsByTitleSchema: ListEventsByTitleValidator
}>

export const listEventsByTitleControllerFactory:ListEventsByTitleController = ({
  listEventsByTitleSchema,
  listEventsByTitleUseCase
}) => {
  return async (req) => {
    const params = listEventsByTitleSchema.parse(req?.query || {})
    const events = await listEventsByTitleUseCase(params.title)    
    return ok(events)
  }
}
