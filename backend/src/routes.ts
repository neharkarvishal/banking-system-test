import { Router } from 'express'

import userController from './modules/users/user.controller'

const router = Router()

const routes = (dependencies) => {
    router.use('/users', userController(dependencies))

    return router
}

export default routes
