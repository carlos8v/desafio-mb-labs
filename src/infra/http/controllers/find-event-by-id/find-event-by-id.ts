import type { FindEventByIdValidator } from './find-event-by-id-validator'
import type { FindEventByIdUseCase } from '@application/useCases/find-event-by-id/find-event-by-id'

import { ok, badRequest, notFound } from '@infra/http/helpers/httpHelper'
import { InvalidEventIdParamError } from '@infra/http/errors/invalid-event-id-param'

type FindEventByIdController = Controller<{
  findEventByIdUseCase: FindEventByIdUseCase
  findEventByIdSchema: FindEventByIdValidator
}>

export const findEventByIdControllerFactory: FindEventByIdController = ({
  findEventByIdUseCase,
  findEventByIdSchema
}) => {
  return async (req) => {
    const eventParams = findEventByIdSchema.safeParse(req.params)
    if (!eventParams.success) {
      return badRequest(new InvalidEventIdParamError())
    }

    const event = await findEventByIdUseCase(eventParams.data.eventId)

    if (event.isLeft()) {
      return notFound(event.value)
    }

    return ok(event.value)
  }
}
