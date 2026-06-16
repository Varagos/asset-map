import { describe, expect, it } from 'vitest'
import { isAssetInsideBBox } from './bbox'
import type { Asset, BBox } from '../../features/assets/model/asset.types'

const asset: Asset = {
  id: 'asset-1',
  name: 'Hydrant H-0001',
  type: 'hydrant',
  status: 'ok',
  lat: 42.36,
  lng: -71.05,
  installed_at: '2020-01-01',
  last_inspected_at: null,
  notes: '',
}

const bbox: BBox = {
  minLng: -71.1,
  minLat: 42.3,
  maxLng: -71,
  maxLat: 42.4,
}

describe('isAssetInsideBBox', () => {
  it('returns true when the asset coordinates are inside the bbox', () => {
    expect(isAssetInsideBBox(asset, bbox)).toBe(true)
  })

  it('returns false when the asset longitude is outside the bbox', () => {
    expect(
      isAssetInsideBBox(
        {
          ...asset,
          lng: -72,
        },
        bbox,
      ),
    ).toBe(false)
  })
})
