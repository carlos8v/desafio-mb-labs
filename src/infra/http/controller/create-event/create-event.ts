import type { Schema } from 'zod'
import type { CreateEventUseCase } from '@application/useCases/create-event/create-event'

import { created, badRequest } from '@infra/http/helpers/httpHelper'

type CreateEventController = Controller<{
  createEventUseCase: CreateEventUseCase
  createEventSchema: Schema
}>

export const createEventControllerFactory: CreateEventController = ({
  createEventUseCase,
  createEventSchema
}) => {
  return async (req) => {
    const eventData = createEventSchema.parse(req.body)
    const newEvent = await createEventUseCase(eventData)

    if (newEvent.isLeft()) {
      return badRequest(newEvent.value)
    }

    return created(newEvent.value)
  }
}
