import { Asset } from '../../domain/asset.entity'
import { AssetOrmEntity } from './asset.orm-entity'
import type { Point, Repository } from 'typeorm'
import type {
  AssetsRepository,
  ListAssetsCriteria,
  PaginatedAssets,
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
  row.name = props.name
  row.type = props.type
  row.status = props.status
  row.installed_at = props.installed_at
  row.last_inspected_at = props.last_inspected_at
  row.notes = props.notes
  row.location = toPoint(props.lat, props.lng)

  return row
}

function toDomain(row: AssetOrmEntity): Asset {
  const [lng, lat] = row.location.coordinates

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new Error(`Asset ${row.id} has invalid coordinates in storage`)
  }

  const props: AssetProps = {
    id: row.id,
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

  async save(asset: Asset): Promise<Asset> {
    const savedRow = await this.repository.save(toOrmEntity(asset))

    return toDomain(savedRow)
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.repository.delete({ id })

    return (result.affected ?? 0) > 0
  }
}
