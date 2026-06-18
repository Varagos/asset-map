import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z
    .string()
    .url()
    .default('postgres://asset_map:asset_map@localhost:5433/asset_map'),
  CORS_ORIGIN: z.string().default('http://127.0.0.1:5173'),
})

export const env = envSchema.parse(process.env)
