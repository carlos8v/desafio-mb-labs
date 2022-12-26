import { Router } from 'express'

import { expressRouteAdapter } from '../adapters/expressRouteAdapter'

import { createUserController } from '../controller/create-user'

export const userRouter = Router()

userRouter.post('/', expressRouteAdapter(createUserController))
