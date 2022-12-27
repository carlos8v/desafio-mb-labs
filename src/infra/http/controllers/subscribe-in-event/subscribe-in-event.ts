import type { FindAuthUserUseCase } from '@application/useCases/find-auth-user/find-auth-user'
import type { SubscribeInEventUseCase } from '@application/useCases/subscribe-in-event/subscribe-in-event'
import type { SubscribeInEventValidator } from '@application/useCases/subscribe-in-event/subscribe-in-event-validator'

import { NotAuthorizedUserError } from '@application/errors/not-authorized-user'
import { InvalidSubscriptionBodyError } from '@infra/http/errors/invalid-subscription-body'

import { badRequest, ok, unauthorized, unprocessableEntity } from '@infra/http/helpers/http-helper'

type SubscribeInEventController = Controller<{
  findAuthUserUseCase: FindAuthUserUseCase
  subscribeInEventUseCase: SubscribeInEventUseCase
  subscribeInEventSchema: SubscribeInEventValidator
}>

export const subscribeInEventControllerFactory: SubscribeInEventController = ({
  findAuthUserUseCase,
  subscribeInEventSchema,
  subscribeInEventUseCase
}) => {
  return async (req) => {
    const auth = req.headers['authorization']
    if (!auth) return unauthorized(new NotAuthorizedUserError())

    const [, token] = auth.split(' ')

    const user = await findAuthUserUseCase(token)
    if (user.isLeft()) return unauthorized(user.value)

    const subscriptionBody = subscribeInEventSchema.safeParse({
      ...req.body,
      userId: user.value.id
    })

    if (!subscriptionBody.success) {
      return unprocessableEntity(new InvalidSubscriptionBodyError(
        subscriptionBody.error.issues.map(({ path }) => String(path))
      ))
    }

    const subscription = await subscribeInEventUseCase(subscriptionBody.data)

    if (subscription.isLeft()) {
      return badRequest(subscription.value)
    }

    return ok({ subscribed: true })
  }
}
