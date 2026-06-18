import { Column, Entity, PrimaryColumn, type Point } from 'typeorm'
import type { AssetStatus, AssetType } from '../../domain/asset.types'

@Entity({ name: 'assets' })
export class AssetOrmEntity {
  @PrimaryColumn('uuid')
  id!: string

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

  @Column('geometry', {
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location!: Point
}
