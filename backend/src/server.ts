import http from 'http'

import app from './app'
import ApiException, { NotFound } from './exceptions/ApiException'
import dbPromise, { knex } from './knex'
import routes from './routes'

Promise.all([dbPromise()])
    .then((dependencies) => {
        const [db] = dependencies

        /** init routes */
        app.use(routes(dependencies))

        /** 404'd paths -> forward to error handler */
        app.use((req, res, next) => {
            next(NotFound())
        })

        /** Error handler */
        app.use((e, req, res, next) => {
            if (e instanceof ApiException) {
                res.status(e.status).json({
                    message: e.message,
                    status: e.status,
                    errors:
                        e.errors && Object.keys(e.errors).length
                            ? e.errors
                            : undefined,
                })
                return
            }

            console.error(`${e.message}\n${e.stack}`) // eslint-disable-line @typescript-eslint/restrict-template-expressions

            const response: Record<string, unknown> = {
                status: 500,
                errors: {},
            }

            // only providing error in development
            if (process.env.NODE_ENV === 'development') {
                response.message = e.message
                response.stack = e.stack
            } else {
                response.message = 'Something went wrong'
            }

            res.status(500).json(response)
        })

        /** Create HTTP server */
        const server = http.createServer(app)
        const port = process.env.PORT || 3000

        server.listen(port)

        server.on('listening', () => {
            console.info(`Listening on ${port}`)
        })

        server.on('error', (error) => {
            // @ts-ignore
            if (error?.syscall !== 'listen') throw error

            // @ts-ignore, handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(`${port} requires elevated privileges`)
                    process.exit(1)
                    break
                case 'EADDRINUSE':
                    console.error(`${port} is already in use`)
                    process.exit(1)
                    break
                default:
                    throw error
            }
        })

        return dependencies
    })
    .catch(console.error)
