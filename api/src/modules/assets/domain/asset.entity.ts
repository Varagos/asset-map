import { randomUUID } from 'node:crypto'
import {
  ASSET_STATUSES,
  ASSET_TYPES,
  type AssetProps,
  type AssetStatus,
  type AssetType,
  type CreateAssetInput,
} from './asset.types'
import { InvalidAssetError } from './asset.errors'

const assetTypeSet = new Set<string>(ASSET_TYPES)
const assetStatusSet = new Set<string>(ASSET_STATUSES)

function isValidDateString(value: string): boolean {
  return value.trim().length > 0 && !Number.isNaN(Date.parse(value))
}

function isFiniteNumber(value: number): boolean {
  return typeof value === 'number' && Number.isFinite(value)
}

function validateAssetProps(props: AssetProps): void {
  const issues: string[] = []

  if (!props.id.trim()) {
    issues.push('id is required')
  }

  if (!props.name.trim()) {
    issues.push('name is required')
  }

  if (!assetTypeSet.has(props.type)) {
    issues.push('type is invalid')
  }

  if (!assetStatusSet.has(props.status)) {
    issues.push('status is invalid')
  }

  if (!isFiniteNumber(props.lat) || props.lat < -90 || props.lat > 90) {
    issues.push('lat must be between -90 and 90')
  }

  if (!isFiniteNumber(props.lng) || props.lng < -180 || props.lng > 180) {
    issues.push('lng must be between -180 and 180')
  }

  if (!isValidDateString(props.installed_at)) {
    issues.push('installed_at must be a valid date string')
  }

  if (
    props.last_inspected_at !== null &&
    !isValidDateString(props.last_inspected_at)
  ) {
    issues.push('last_inspected_at must be a valid date string or null')
  }

  if (typeof props.notes !== 'string') {
    issues.push('notes must be a string')
  }

  if (issues.length > 0) {
    throw new InvalidAssetError('Asset is invalid', issues)
  }
}

export class Asset {
  private constructor(private readonly props: AssetProps) {}

  static create(input: CreateAssetInput, id = randomUUID()): Asset {
    return Asset.reconstitute({
      ...input,
      id,
      name: input.name.trim(),
      notes: input.notes,
    })
  }

  static reconstitute(props: AssetProps): Asset {
    validateAssetProps(props)

    return new Asset({ ...props, name: props.name.trim() })
  }

  rename(name: string): Asset {
    return Asset.reconstitute({
      ...this.props,
      name: name.trim(),
    })
  }

  changeType(type: AssetType): Asset {
    return Asset.reconstitute({
      ...this.props,
      type,
    })
  }

  changeStatus(status: AssetStatus): Asset {
    return Asset.reconstitute({
      ...this.props,
      status,
    })
  }

  relocate(lat: number, lng: number): Asset {
    return Asset.reconstitute({
      ...this.props,
      lat,
      lng,
    })
  }

  changeInstallationDate(installedAt: string): Asset {
    return Asset.reconstitute({
      ...this.props,
      installed_at: installedAt,
    })
  }

  changeLastInspectionDate(lastInspectedAt: string | null): Asset {
    return Asset.reconstitute({
      ...this.props,
      last_inspected_at: lastInspectedAt,
    })
  }

  changeNotes(notes: string): Asset {
    return Asset.reconstitute({
      ...this.props,
      notes,
    })
  }

  toPrimitives(): AssetProps {
    return { ...this.props }
  }
}
