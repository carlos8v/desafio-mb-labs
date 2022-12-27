import { Router } from 'express'

import { expressRouteAdapter } from '../adapters/express-route-adapter'

import { createUserController } from '../controllers/create-user'
import { loginUserController } from '../controllers/login-user'

export const userRouter = Router()

userRouter.post('/', expressRouteAdapter(createUserController))
userRouter.post('/login', expressRouteAdapter(loginUserController))
