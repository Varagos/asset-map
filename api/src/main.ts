import 'reflect-metadata'
import { createApp } from './app'
import { createProductionContainer } from './composition-root'
import { AppDataSource } from './database/data-source'
import { env } from './config/env'

async function bootstrap(): Promise<void> {
  const container = await createProductionContainer()
  const app = createApp(container)
  const server = app.listen(env.PORT, () => {
    console.log(`API listening on http://127.0.0.1:${env.PORT}`)
  })

  const shutdown = async () => {
    server.close()

    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
  }

  process.on('SIGTERM', () => {
    void shutdown()
  })
  process.on('SIGINT', () => {
    void shutdown()
  })
}

bootstrap().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
