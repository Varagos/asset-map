import { AppDataSource } from './database/data-source'
import { createAssetsApplication } from './modules/assets/application/assets.application'
import { AssetOrmEntity } from './modules/assets/infrastructure/typeorm/asset.orm-entity'
import { TypeOrmAssetsRepository } from './modules/assets/infrastructure/typeorm/typeorm-assets.repository'

export async function createProductionContainer() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
  }

  const assetsRepository = new TypeOrmAssetsRepository(
    AppDataSource.getRepository(AssetOrmEntity),
  )

  return {
    assets: createAssetsApplication(assetsRepository),
  }
}
