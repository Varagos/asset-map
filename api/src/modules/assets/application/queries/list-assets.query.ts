import { toAssetDto, type AssetDto } from '../asset.dto'
import type {
  AssetsRepository,
  ListAssetsCriteria,
} from '../ports/assets.repository'

export type ListAssetsResult = {
  items: AssetDto[]
  total: number
  limit: number
  offset: number
}

export class ListAssetsQueryHandler {
  constructor(private readonly assetsRepository: AssetsRepository) {}

  async execute(criteria: ListAssetsCriteria): Promise<ListAssetsResult> {
    const result = await this.assetsRepository.list(criteria)

    return {
      items: result.items.map(toAssetDto),
      total: result.total,
      limit: result.limit,
      offset: result.offset,
    }
  }
}
