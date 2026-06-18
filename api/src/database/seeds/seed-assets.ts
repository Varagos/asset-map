import 'reflect-metadata'
import { z } from 'zod'
import seedAssets from './seed.json'
import { AppDataSource } from '../data-source'
import { Asset } from '../../modules/assets/domain/asset.entity'
import { TypeOrmAssetsRepository } from '../../modules/assets/infrastructure/typeorm/typeorm-assets.repository'
import { AssetOrmEntity } from '../../modules/assets/infrastructure/typeorm/asset.orm-entity'
import {
  ASSET_STATUSES,
  ASSET_TYPES,
} from '../../modules/assets/domain/asset.types'

const seedAssetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: z.enum(ASSET_TYPES),
  status: z.enum(ASSET_STATUSES),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  installed_at: z.string().min(1),
  last_inspected_at: z.string().min(1).nullable(),
  notes: z.string(),
})

async function seed(): Promise<void> {
  const parsedSeedAssets = z.array(seedAssetSchema).parse(seedAssets)

  await AppDataSource.initialize()

  const repository = new TypeOrmAssetsRepository(
    AppDataSource.getRepository(AssetOrmEntity),
  )

  for (const seedAsset of parsedSeedAssets) {
    await repository.save(Asset.reconstitute({ ...seedAsset, version: 1 }))
  }

  console.log(`Seeded ${parsedSeedAssets.length} assets`)
  await AppDataSource.destroy()
}

seed().catch(async (error: unknown) => {
  console.error(error)

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy()
  }

  process.exit(1)
})
