import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { env } from '../config/env'
import { CreateAssets1710000000000 } from './migrations/1710000000000-CreateAssets'
import { AssetOrmEntity } from '../modules/assets/infrastructure/typeorm/asset.orm-entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  synchronize: false,
  migrationsRun: false,
  dropSchema: false,
  installExtensions: false,
  entities: [AssetOrmEntity],
  migrations: [CreateAssets1710000000000],
  logging: env.NODE_ENV === 'development' ? ['error', 'warn', 'schema'] : ['error'],
  invalidWhereValuesBehavior: {
    null: 'throw',
    undefined: 'throw',
  },
})
