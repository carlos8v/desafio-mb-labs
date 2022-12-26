import { Router } from 'express'

import { expressRouteAdapter } from '../adapters/expressRouteAdapter'

import { createUserController } from '../controllers/create-user'

export const userRouter = Router()

userRouter.post('/', expressRouteAdapter(createUserController))
