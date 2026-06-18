import { describe, expect, it } from 'vitest'
import {
  assetBodySchema,
  listAssetsQuerySchema,
} from './assets.http-schemas'

describe('asset HTTP schemas', () => {
  it('rejects partial bbox query params', () => {
    expect(
      listAssetsQuerySchema.safeParse({ minLat: '1', maxLat: '2' }).success,
    ).toBe(false)
  })

  it('accepts full bbox and parses pagination', () => {
    const result = listAssetsQuerySchema.parse({
      minLng: '-72',
      minLat: '42',
      maxLng: '-70',
      maxLat: '43',
      limit: '25',
      offset: '50',
      sort: 'name',
    })

    expect(result).toEqual({
      bbox: { minLng: -72, minLat: 42, maxLng: -70, maxLat: 43 },
      limit: 25,
      offset: 50,
      sort: 'name',
    })
  })

  it('normalizes empty last_inspected_at to null', () => {
    const result = assetBodySchema.parse({
      name: 'Valve V-0001',
      type: 'valve',
      status: 'warning',
      lat: 42,
      lng: -71,
      installed_at: '2021-01-01',
      last_inspected_at: '',
      notes: '',
    })

    expect(result.last_inspected_at).toBeNull()
  })
})
