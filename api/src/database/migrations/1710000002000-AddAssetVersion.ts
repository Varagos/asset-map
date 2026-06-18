import type { MigrationInterface, QueryRunner } from 'typeorm'

export class AddAssetVersion1710000002000 implements MigrationInterface {
  name = 'AddAssetVersion1710000002000'

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE assets
      ADD COLUMN version integer NOT NULL DEFAULT 1
    `)
    await queryRunner.query(`
      ALTER TABLE assets
      ADD CONSTRAINT assets_version_positive_check CHECK (version >= 1)
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE assets
      DROP CONSTRAINT IF EXISTS assets_version_positive_check
    `)
    await queryRunner.query(`
      ALTER TABLE assets
      DROP COLUMN IF EXISTS version
    `)
  }
}
