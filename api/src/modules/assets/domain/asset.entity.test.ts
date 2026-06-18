import { describe, expect, it } from 'vitest'
import { Asset } from './asset.entity'
import { InvalidAssetError } from './asset.errors'

const validAsset = {
  id: '17fc695a-07a0-4a6e-8822-e8f36c031199',
  version: 1,
  name: 'Sensor S-0001',
  type: 'sensor' as const,
  status: 'ok' as const,
  lat: 42.373366,
  lng: -71.133174,
  installed_at: '2001-04-05',
  last_inspected_at: '2025-09-21',
  notes: '',
}

describe('Asset', () => {
  it('accepts a valid asset and normalizes the name', () => {
    const asset = Asset.reconstitute({
      ...validAsset,
      name: '  Sensor S-0001 ',
    })

    expect(asset.toPrimitives().name).toBe('Sensor S-0001')
  })

  it('rejects invalid coordinates', () => {
    expect(() => Asset.reconstitute({ ...validAsset, lat: 91 })).toThrow(
      InvalidAssetError,
    )
  })

  it('accepts null last_inspected_at', () => {
    const asset = Asset.reconstitute({
      ...validAsset,
      last_inspected_at: null,
    })

    expect(asset.toPrimitives().last_inspected_at).toBeNull()
  })

  it('rejects last_inspected_at before installed_at', () => {
    expect(() =>
      Asset.reconstitute({
        ...validAsset,
        installed_at: '2025-01-10',
        last_inspected_at: '2025-01-09',
      }),
    ).toThrow(InvalidAssetError)
  })

  it('accepts last_inspected_at on installed_at', () => {
    const asset = Asset.reconstitute({
      ...validAsset,
      installed_at: '2025-01-10',
      last_inspected_at: '2025-01-10',
    })

    expect(asset.toPrimitives().last_inspected_at).toBe('2025-01-10')
  })

  it('updates through fine-grained domain methods', () => {
    const asset = Asset.reconstitute(validAsset)

    asset.rename('Sensor S-0001A')
    asset.changeStatus('warning')
    asset.relocate(42, -71)

    expect(asset.toPrimitives()).toMatchObject({
      name: 'Sensor S-0001A',
      status: 'warning',
      lat: 42,
      lng: -71,
    })
  })
})
