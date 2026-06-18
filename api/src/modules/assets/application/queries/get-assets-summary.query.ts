import type {
  AssetsRepository,
  AssetsSummary,
} from '../ports/assets.repository'

export class GetAssetsSummaryQueryHandler {
  constructor(private readonly assetsRepository: AssetsRepository) {}

  execute(): Promise<AssetsSummary> {
    return this.assetsRepository.summary()
  }
}
