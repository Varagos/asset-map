import { Asset } from '../../domain/asset.entity'
import { AssetVersionConflictError } from '../../domain/asset.errors'
import { AssetOrmEntity } from './asset.orm-entity'
import type { Point, Repository } from 'typeorm'
import type {
  DeleteAssetOptions,
  AssetsRepository,
  ListAssetsCriteria,
  PaginatedAssets,
  SaveAssetOptions,
} from '../../application/ports/assets.repository'
import type { AssetProps } from '../../domain/asset.types'

function toPoint(lat: number, lng: number): Point {
  return {
    type: 'Point',
    coordinates: [lng, lat],
  }
}

function toOrmEntity(asset: Asset): AssetOrmEntity {
  const props = asset.toPrimitives()
  const row = new AssetOrmEntity()

  row.id = props.id
  row.version = props.version
  row.name = props.name
  row.type = props.type
  row.status = props.status
  row.installed_at = props.installed_at
  row.last_inspected_at = props.last_inspected_at
  row.notes = props.notes
  row.location = toPoint(props.lat, props.lng)

  return row
}

function toOrmUpdateSet(
  asset: Asset,
): Pick<
  AssetOrmEntity,
  | 'name'
  | 'type'
  | 'status'
  | 'installed_at'
  | 'last_inspected_at'
  | 'notes'
  | 'location'
> {
  const props = asset.toPrimitives()

  return {
    name: props.name,
    type: props.type,
    status: props.status,
    installed_at: props.installed_at,
    last_inspected_at: props.last_inspected_at,
    notes: props.notes,
    location: toPoint(props.lat, props.lng),
  }
}

function toDomain(row: AssetOrmEntity): Asset {
  const [lng, lat] = row.location.coordinates

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new Error(`Asset ${row.id} has invalid coordinates in storage`)
  }

  const props: AssetProps = {
    id: row.id,
    version: row.version,
    name: row.name,
    type: row.type,
    status: row.status,
    lat,
    lng,
    installed_at: row.installed_at,
    last_inspected_at: row.last_inspected_at,
    notes: row.notes,
  }

  return Asset.reconstitute(props)
}

export class TypeOrmAssetsRepository implements AssetsRepository {
  constructor(private readonly repository: Repository<AssetOrmEntity>) {}

  async list(criteria: ListAssetsCriteria): Promise<PaginatedAssets> {
    const queryBuilder = this.repository.createQueryBuilder('asset')

    if (criteria.type) {
      queryBuilder.andWhere('asset.type = :type', { type: criteria.type })
    }

    if (criteria.status) {
      queryBuilder.andWhere('asset.status = :status', {
        status: criteria.status,
      })
    }

    if (criteria.bbox) {
      // PostGIS envelopes use x/y ordering, so GPS bounds are lng/lat.
      // ST_Covers keeps assets on the map edge included in the result.
      queryBuilder.andWhere(
        `ST_Covers(
          ST_MakeEnvelope(:minLng, :minLat, :maxLng, :maxLat, 4326),
          asset.location
        )`,
        criteria.bbox,
      )
    }

    if (criteria.sort === 'name') {
      queryBuilder.orderBy('asset.name', 'ASC')
    } else {
      queryBuilder
        .orderBy(
          `CASE asset.status
            WHEN 'critical' THEN 0
            WHEN 'warning' THEN 1
            ELSE 2
          END`,
          'ASC',
        )
        .addOrderBy('asset.name', 'ASC')
    }

    const [rows, total] = await queryBuilder
      .skip(criteria.offset)
      .take(criteria.limit)
      .getManyAndCount()

    return {
      items: rows.map(toDomain),
      total,
      limit: criteria.limit,
      offset: criteria.offset,
    }
  }

  async findById(id: string): Promise<Asset | null> {
    const row = await this.repository.findOneBy({ id })

    return row ? toDomain(row) : null
  }

  async save(asset: Asset, options?: SaveAssetOptions): Promise<Asset> {
    if (options?.expectedVersion !== undefined) {
      return this.updateWithExpectedVersion(asset, options.expectedVersion)
    }

    const savedRow = await this.repository.save(toOrmEntity(asset))

    return toDomain(savedRow)
  }

  async deleteById(id: string, options?: DeleteAssetOptions): Promise<boolean> {
    const result = await this.repository.delete(
      options?.expectedVersion === undefined
        ? { id }
        : { id, version: options.expectedVersion },
    )

    return (result.affected ?? 0) > 0
  }

  private async updateWithExpectedVersion(
    asset: Asset,
    expectedVersion: number,
  ): Promise<Asset> {
    const { id } = asset.toPrimitives()
    const result = await this.repository
      .createQueryBuilder()
      .update(AssetOrmEntity)
      .set(toOrmUpdateSet(asset))
      .where('id = :id', { id })
      .andWhere('version = :expectedVersion', { expectedVersion })
      .execute()

    if ((result.affected ?? 0) === 0) {
      throw new AssetVersionConflictError(id)
    }

    const savedRow = await this.repository.findOneByOrFail({ id })

    return toDomain(savedRow)
  }
}
