import { describe, expect, it } from 'vitest'
import { assetFormSchema } from './asset.schema'

const validAssetFormInput = {
  name: 'Sensor S-0001',
  type: 'sensor',
  status: 'ok',
  lat: 42.36,
  lng: -71.05,
  installed_at: '2020-01-01',
  last_inspected_at: '',
  notes: '',
}

describe('assetFormSchema', () => {
  it('rejects invalid coordinates', () => {
    expect(
      assetFormSchema.safeParse({
        ...validAssetFormInput,
        lat: 91,
      }).success,
    ).toBe(false)

    expect(
      assetFormSchema.safeParse({
        ...validAssetFormInput,
        lng: -181,
      }).success,
    ).toBe(false)
  })

  it('accepts an empty or null last inspected date', () => {
    expect(assetFormSchema.safeParse(validAssetFormInput).success).toBe(true)
    expect(
      assetFormSchema.safeParse({
        ...validAssetFormInput,
        last_inspected_at: null,
      }).success,
    ).toBe(true)
  })

  it('rejects last inspected dates before the installed date', () => {
    expect(
      assetFormSchema.safeParse({
        ...validAssetFormInput,
        installed_at: '2025-01-02',
        last_inspected_at: '2025-01-01',
      }).success,
    ).toBe(false)
  })

  it('accepts last inspected dates on the installed date', () => {
    expect(
      assetFormSchema.safeParse({
        ...validAssetFormInput,
        installed_at: '2025-01-02',
        last_inspected_at: '2025-01-02',
      }).success,
    ).toBe(true)
  })
})
