import type { FindEventSubscriptionsUseCase } from '@application/useCases/find-event-subscriptions/find-event-subscriptions'
import type { FindEventSubscriptionsValidator } from '@application/useCases/find-event-subscriptions/find-event-subscriptions-validator'
import type { FindAuthUserUseCase } from '@application/useCases/find-auth-user/find-auth-user'

import { NonexistentEventError } from '@application/errors/nonexistent-event'
import { InvalidEventIdParamError } from '@infra/http/errors/invalid-event-id-param'

import { ok, badRequest, notFound, forbidden, unauthorized } from '@infra/http/helpers/http-helper'
import { NotAuthorizedUserError } from '@application/errors/not-authorized-user'

type FindEventSubscriptionsController = Controller<{
  findAuthUserUseCase: FindAuthUserUseCase
  findEventSubscriptionsSchema: FindEventSubscriptionsValidator
  findEventSubscriptionsUseCase: FindEventSubscriptionsUseCase
}>

export const findEventSubscriptionsControllerFactory: FindEventSubscriptionsController = ({
  findAuthUserUseCase,
  findEventSubscriptionsSchema,
  findEventSubscriptionsUseCase
}) => {
  return async (req) => {
    const auth = req.headers['authorization']
    if (!auth) return unauthorized(new NotAuthorizedUserError())

    const [, token] = auth.split(' ')

    const user = await findAuthUserUseCase(token)
    if (user.isLeft()) return unauthorized(user.value)

    const findEventRequest = findEventSubscriptionsSchema.safeParse({
      userId: user.value.id,
      eventId: req.params.eventId
    })

    if (!findEventRequest.success) {
      return badRequest(new InvalidEventIdParamError())
    }

    const eventSubscriptions = await findEventSubscriptionsUseCase(findEventRequest.data)
    if (eventSubscriptions.isLeft()) {
      if (eventSubscriptions.value instanceof NonexistentEventError) {
        return notFound(eventSubscriptions.value)
      }

      return forbidden(eventSubscriptions.value)
    }

    return ok(eventSubscriptions.value)
  }
}
