import type { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAssets1710000000000 implements MigrationInterface {
  name = 'CreateAssets1710000000000'

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS postgis')
    await queryRunner.query(`
      CREATE TABLE assets (
        id uuid PRIMARY KEY,
        name varchar(120) NOT NULL,
        type varchar(32) NOT NULL,
        status varchar(32) NOT NULL,
        installed_at date NOT NULL,
        last_inspected_at date NULL,
        notes text NOT NULL DEFAULT '',
        location geometry(Point, 4326) NOT NULL,
        CONSTRAINT assets_type_check CHECK (type IN ('pipe', 'hydrant', 'sensor', 'valve')),
        CONSTRAINT assets_status_check CHECK (status IN ('ok', 'warning', 'critical'))
      )
    `)
    await queryRunner.query(
      'CREATE INDEX assets_location_gist_idx ON assets USING GIST (location)',
    )
    await queryRunner.query(
      'CREATE INDEX assets_type_status_idx ON assets (type, status)',
    )
    await queryRunner.query('CREATE INDEX assets_name_idx ON assets (name)')
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS assets')
  }
}
