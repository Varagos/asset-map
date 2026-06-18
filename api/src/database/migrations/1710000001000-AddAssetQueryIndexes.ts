import type { MigrationInterface, QueryRunner } from 'typeorm'

export class AddAssetQueryIndexes1710000001000 implements MigrationInterface {
  name = 'AddAssetQueryIndexes1710000001000'
  transaction = false

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS assets_status_name_idx
      ON assets (status, name)
    `)
    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS assets_status_rank_name_idx
      ON assets (
        (CASE status
          WHEN 'critical' THEN 0
          WHEN 'warning' THEN 1
          ELSE 2
        END),
        name
      )
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX CONCURRENTLY IF EXISTS assets_status_rank_name_idx',
    )
    await queryRunner.query(
      'DROP INDEX CONCURRENTLY IF EXISTS assets_status_name_idx',
    )
  }
}
