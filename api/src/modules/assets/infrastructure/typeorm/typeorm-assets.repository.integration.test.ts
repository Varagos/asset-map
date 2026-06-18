import { describe, expect, it } from 'vitest'
import { DataSource } from 'typeorm'
import { CreateAssets1710000000000 } from '../../../../database/migrations/1710000000000-CreateAssets'
import { AddAssetQueryIndexes1710000001000 } from '../../../../database/migrations/1710000001000-AddAssetQueryIndexes'
import { AddAssetVersion1710000002000 } from '../../../../database/migrations/1710000002000-AddAssetVersion'
import { Asset } from '../../domain/asset.entity'
import { AssetVersionConflictError } from '../../domain/asset.errors'
import { AssetOrmEntity } from './asset.orm-entity'
import { TypeOrmAssetsRepository } from './typeorm-assets.repository'

const runDbTests = process.env.RUN_DB_TESTS === 'true'

describe.runIf(runDbTests)('TypeOrmAssetsRepository', () => {
  it('persists and filters assets by bbox using PostGIS', async () => {
    const dataSource = new DataSource({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ??
        'postgres://asset_map:asset_map@localhost:5433/asset_map',
      synchronize: false,
      migrationsRun: false,
      migrationsTransactionMode: 'each',
      dropSchema: false,
      installExtensions: false,
      entities: [AssetOrmEntity],
      migrations: [
        CreateAssets1710000000000,
        AddAssetQueryIndexes1710000001000,
        AddAssetVersion1710000002000,
      ],
    })

    await dataSource.initialize()
    await dataSource.runMigrations()
    await dataSource.query('TRUNCATE TABLE assets')

    const repository = new TypeOrmAssetsRepository(
      dataSource.getRepository(AssetOrmEntity),
    )

    await repository.save(
      Asset.reconstitute({
        id: '17fc695a-07a0-4a6e-8822-e8f36c031199',
        version: 1,
        name: 'Sensor A',
        type: 'sensor',
        status: 'ok',
        lat: 10,
        lng: 10,
        installed_at: '2020-01-01',
        last_inspected_at: null,
        notes: '',
      }),
    )

    const result = await repository.list({
      bbox: { minLng: 9, minLat: 9, maxLng: 10, maxLat: 10 },
      limit: 10,
      offset: 0,
      sort: 'status',
    })

    expect(result.total).toBe(1)
    expect(result.items[0]?.toPrimitives().name).toBe('Sensor A')
    await expect(repository.summary()).resolves.toEqual({
      total: 1,
      ok: 1,
      warning: 0,
      critical: 0,
    })

    const asset = await repository.findById(
      '17fc695a-07a0-4a6e-8822-e8f36c031199',
    )

    expect(asset).not.toBeNull()
    if (!asset) {
      throw new Error('Expected seeded asset to exist')
    }

    asset.changeStatus('critical')

    const updatedAsset = await repository.save(asset, {
      expectedVersion: 1,
    })

    expect(updatedAsset.toPrimitives()).toMatchObject({
      status: 'critical',
      version: 2,
    })

    asset.changeStatus('warning')

    await expect(
      repository.save(asset, { expectedVersion: 1 }),
    ).rejects.toThrow(AssetVersionConflictError)

    await dataSource.destroy()
  })
})
