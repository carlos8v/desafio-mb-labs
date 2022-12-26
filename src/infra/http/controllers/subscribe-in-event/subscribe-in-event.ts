import type { SubscribeInEventUseCase } from '@application/useCases/subscribe-in-event/subscribe-in-event'
import type { SubscribeInEventValidator } from '@application/useCases/subscribe-in-event/subscribe-in-event-validator'
import { InvalidSubscriptionBodyError } from '@infra/http/errors/invalid-subscription-body'

import { badRequest, ok, unprocessableEntity } from '@infra/http/helpers/httpHelper'

type SubscribeInEventController = Controller<{
  subscribeInEventUseCase: SubscribeInEventUseCase
  subscribeInEventSchema: SubscribeInEventValidator
}>

export const subscribeInEventControllerFactory: SubscribeInEventController = ({
  subscribeInEventSchema,
  subscribeInEventUseCase
}) => {
  return async (req) => {
    const subscriptionBody = subscribeInEventSchema.safeParse(req.body)
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
