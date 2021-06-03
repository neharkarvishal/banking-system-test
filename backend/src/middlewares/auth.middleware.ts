import { NextFunction, Response, Request, RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

import ApiException, { NotFound, Unauthorized } from '../exceptions/ApiException'

const secret = process.env.JWT_SECRET ?? 'JWT_SECRET'

const authMiddleware = (
    {
        role,
    }: {
        role: RoleType | undefined
    } = { role: undefined },
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            /** Check Authorization token present */
            if (!req.headers.authorization) throw Unauthorized()

            /** token format -> Bearer {TOKEN} */
            const [scheme, token] = req.headers.authorization.split(' ')
            if (scheme !== 'Bearer' || !token) throw Unauthorized()

            jwt.verify(
                token,
                secret,
                {},
                (err, user: Partial<{ role: string }> | undefined) => {
                    /** check error'd  || check is role is required */
                    if (err) throw Unauthorized()

                    if (
                        role &&
                        user &&
                        user?.role &&
                        user?.role.toUpperCase() === role
                    )
                        throw Unauthorized()

                    // @ts-ignore
                    req.user = user

                    return next()
                },
            )
        } catch (e) {
            return next(e)
        }
    }
}

export default authMiddleware
