import {
  Check,
  Column,
  Entity,
  Index,
  PrimaryColumn,
  VersionColumn,
  type Point,
} from 'typeorm'
import type { AssetStatus, AssetType } from '../../domain/asset.types'

@Entity({ name: 'assets' })
@Check('assets_type_check', `"type" IN ('pipe', 'hydrant', 'sensor', 'valve')`)
@Check('assets_status_check', `"status" IN ('ok', 'warning', 'critical')`)
@Check('assets_version_positive_check', '"version" >= 1')
@Index('assets_type_status_idx', ['type', 'status'])
@Index('assets_status_name_idx', ['status', 'name'])
@Index('assets_status_rank_name_idx', { synchronize: false })
export class AssetOrmEntity {
  @PrimaryColumn('uuid')
  id!: string

  @VersionColumn({ type: 'integer', default: 1 })
  version!: number

  @Index('assets_name_idx')
  @Column({ type: 'varchar', length: 120 })
  name!: string

  @Column({ type: 'varchar', length: 32 })
  type!: AssetType

  @Column({ type: 'varchar', length: 32 })
  status!: AssetStatus

  @Column({ type: 'date' })
  installed_at!: string

  @Column({ type: 'date', nullable: true })
  last_inspected_at!: string | null

  @Column({ type: 'text', default: '' })
  notes!: string

  @Index('assets_location_gist_idx', { spatial: true })
  @Column('geometry', {
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location!: Point
}
