import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env'
import { createAssetsRouter } from './modules/assets/presentation/http/v1/assets.controller'
import { errorHandlerMiddleware } from './shared/http/error-handler.middleware'
import { notFoundMiddleware } from './shared/http/not-found.middleware'
import { requestIdMiddleware } from './shared/http/request-id.middleware'
import type { AssetsApplication } from './modules/assets/application/assets.application'

export type AppContainer = {
  assets: AssetsApplication
}

export function createApp(container: AppContainer): express.Express {
  const app = express()

  app.disable('x-powered-by')
  app.use(helmet())
  app.use(cors({ origin: env.CORS_ORIGIN }))
  app.use(express.json({ limit: '1mb' }))
  app.use(requestIdMiddleware)
  app.use(
    morgan(':method :url :status :response-time ms - :res[content-length]', {
      skip: () => env.NODE_ENV === 'test',
    }),
  )

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' })
  })

  app.use('/api/v1/assets', createAssetsRouter(container.assets))
  app.use(notFoundMiddleware)
  app.use(errorHandlerMiddleware)

  return app
}
