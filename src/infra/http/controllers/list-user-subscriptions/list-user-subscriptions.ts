import type { FindAuthUserUseCase } from '@application/useCases/find-auth-user/find-auth-user'
import type { ListUserSubscriptionsUseCase } from '@application/useCases/list-user-subscriptions/list-user-subscriptions'

import { NotAuthorizedUserError } from '@application/errors/not-authorized-user'

import { ok, badRequest, unauthorized } from '@infra/http/helpers/http-helper'

type ListUserSubscriptionsController = Controller<{
  findAuthUserUseCase: FindAuthUserUseCase
  listUserSubscriptionsUseCase: ListUserSubscriptionsUseCase
}>

export const listUserSubscriptionsControllerFactory: ListUserSubscriptionsController = ({
  findAuthUserUseCase,
  listUserSubscriptionsUseCase
}) => {
  return async (req) => {
    const auth = req.headers['authorization']
    if (!auth) return unauthorized(new NotAuthorizedUserError())

    const [, token] = auth.split(' ')

    const user = await findAuthUserUseCase(token)
    if (user.isLeft()) return unauthorized(user.value)

    const userSubscriptions = await listUserSubscriptionsUseCase(user.value.id)
    return ok(userSubscriptions)
  }
}
