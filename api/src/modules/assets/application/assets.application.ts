import { CreateAssetCommandHandler } from './commands/create-asset.command'
import { DeleteAssetCommandHandler } from './commands/delete-asset.command'
import { UpdateAssetCommandHandler } from './commands/update-asset.command'
import { GetAssetByIdQueryHandler } from './queries/get-asset-by-id.query'
import { ListAssetsQueryHandler } from './queries/list-assets.query'
import type { AssetsRepository } from './ports/assets.repository'

export type AssetsApplication = {
  listAssets: ListAssetsQueryHandler
  getAssetById: GetAssetByIdQueryHandler
  createAsset: CreateAssetCommandHandler
  updateAsset: UpdateAssetCommandHandler
  deleteAsset: DeleteAssetCommandHandler
}

export function createAssetsApplication(
  assetsRepository: AssetsRepository,
): AssetsApplication {
  return {
    listAssets: new ListAssetsQueryHandler(assetsRepository),
    getAssetById: new GetAssetByIdQueryHandler(assetsRepository),
    createAsset: new CreateAssetCommandHandler(assetsRepository),
    updateAsset: new UpdateAssetCommandHandler(assetsRepository),
    deleteAsset: new DeleteAssetCommandHandler(assetsRepository),
  }
}
