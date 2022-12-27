import { InvalidEventBodyError } from '@infra/http/errors/invalid-event-body'

import type { CreateEventUseCase } from '@application/useCases/create-event/create-event'
import type { CreateEventValidator } from '@application/useCases/create-event/create-event-validator'

import { created, badRequest, unprocessableEntity } from '@infra/http/helpers/http-helper'

type CreateEventController = Controller<{
  createEventUseCase: CreateEventUseCase
  createEventSchema: CreateEventValidator
}>

export const createEventControllerFactory: CreateEventController = ({
  createEventUseCase,
  createEventSchema
}) => {
  return async (req) => {
    const eventBody = createEventSchema.safeParse(req.body)
    if (!eventBody.success) {
      return unprocessableEntity(new InvalidEventBodyError(
        eventBody.error.issues.map(({ path }) => String(path))
      ))
    }

    const newEvent = await createEventUseCase(eventBody.data)

    if (newEvent.isLeft()) {
      return badRequest(newEvent.value)
    }

    return created(newEvent.value)
  }
}
