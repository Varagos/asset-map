import { describe, expect, it } from 'vitest'
import { ListAssetsQueryHandler } from './list-assets.query'
import { Asset } from '../../domain/asset.entity'
import { FakeAssetsRepository } from '../../../../test/fake-assets.repository'

const assets = [
  Asset.reconstitute({
    id: '17fc695a-07a0-4a6e-8822-e8f36c031199',
    name: 'Sensor A',
    type: 'sensor',
    status: 'critical',
    lat: 10,
    lng: 10,
    installed_at: '2020-01-01',
    last_inspected_at: null,
    notes: '',
  }),
  Asset.reconstitute({
    id: 'cfe313dc-b092-4238-a56f-b3b5e477fdd0',
    name: 'Valve B',
    type: 'valve',
    status: 'ok',
    lat: 30,
    lng: 30,
    installed_at: '2020-01-01',
    last_inspected_at: null,
    notes: '',
  }),
]

describe('ListAssetsQueryHandler', () => {
  it('returns filtered paginated asset DTOs', async () => {
    const handler = new ListAssetsQueryHandler(new FakeAssetsRepository(assets))

    await expect(
      handler.execute({
        type: 'sensor',
        bbox: { minLat: 9, minLng: 9, maxLat: 11, maxLng: 11 },
        limit: 10,
        offset: 0,
        sort: 'status',
      }),
    ).resolves.toMatchObject({
      total: 1,
      items: [{ name: 'Sensor A' }],
    })
  })
})
