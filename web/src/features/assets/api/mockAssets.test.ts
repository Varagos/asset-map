import { describe, expect, it } from 'vitest'
import { filterAssets } from './mockAssets'
import type { Asset } from '../model/asset.types'

const assets: Asset[] = [
  {
    id: 'asset-1',
    name: 'Pipe P-0001',
    type: 'pipe',
    status: 'ok',
    lat: 42.36,
    lng: -71.05,
    installed_at: '2020-01-01',
    last_inspected_at: null,
    notes: 'north zone',
  },
  {
    id: 'asset-2',
    name: 'Sensor S-0002',
    type: 'sensor',
    status: 'warning',
    lat: 41,
    lng: -70,
    installed_at: '2021-01-01',
    last_inspected_at: '2025-01-01',
    notes: '',
  },
  {
    id: 'asset-3',
    name: 'Valve V-0003',
    type: 'valve',
    status: 'critical',
    lat: 42.38,
    lng: -71.06,
    installed_at: '2022-01-01',
    last_inspected_at: null,
    notes: '',
  },
]

describe('filterAssets', () => {
  it('filters assets by type and status', () => {
    expect(filterAssets(assets, { type: 'sensor', status: 'warning' })).toEqual([
      assets[1],
    ])
  })

  it('filters assets by bbox', () => {
    expect(
      filterAssets(assets, {
        bbox: {
          minLng: -71.1,
          minLat: 42.3,
          maxLng: -71,
          maxLat: 42.4,
        },
      }),
    ).toEqual([assets[0], assets[2]])
  })
})
