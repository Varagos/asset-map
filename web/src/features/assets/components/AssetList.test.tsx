import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AssetList } from './AssetList'
import type { Asset } from '../model/asset.types'

const filteredAssets: Asset[] = [
  {
    id: 'asset-1',
    version: 1,
    name: 'Pipe P-0001',
    type: 'pipe',
    status: 'ok',
    lat: 42.36,
    lng: -71.05,
    installed_at: '2020-01-01',
    last_inspected_at: null,
    notes: '',
  },
]

describe('AssetList', () => {
  it('renders filtered assets and pagination result text', () => {
    render(
      <AssetList
        assets={filteredAssets}
        isAreaFilterActive={false}
        onPageChange={vi.fn()}
        onSelectAsset={vi.fn()}
        onSortChange={vi.fn()}
        page={1}
        pageSize={50}
        selectedAssetId={null}
        sort="status"
        totalAssets={1}
        totalPages={1}
      />,
    )

    expect(screen.getByText('Assets')).toBeInTheDocument()
    expect(screen.getByText('Showing 1 asset')).toBeInTheDocument()
    expect(screen.getByText('Pipe P-0001')).toBeInTheDocument()
  })
})
