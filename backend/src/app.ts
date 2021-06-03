import cors from 'cors'
import express from 'express'

/** initialize your `app` with routes from Modules */
const app = express()

/** Setting up middlewares */
app.use(express.json(), express.urlencoded({ extended: false }), cors())

export default app
