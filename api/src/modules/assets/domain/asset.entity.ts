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

function toDateOnlyTimestamp(value: string): number {
  const date = new Date(value)

  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

function isFiniteNumber(value: number): boolean {
  return typeof value === 'number' && Number.isFinite(value)
}

function validateAssetProps(props: AssetProps): void {
  const issues: string[] = []

  if (!props.id.trim()) {
    issues.push('id is required')
  }

  if (!Number.isInteger(props.version) || props.version < 1) {
    issues.push('version must be a positive integer')
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

  if (
    isValidDateString(props.installed_at) &&
    props.last_inspected_at !== null &&
    isValidDateString(props.last_inspected_at) &&
    toDateOnlyTimestamp(props.last_inspected_at) <
      toDateOnlyTimestamp(props.installed_at)
  ) {
    issues.push('last_inspected_at cannot be before installed_at')
  }

  if (typeof props.notes !== 'string') {
    issues.push('notes must be a string')
  }

  if (issues.length > 0) {
    throw new InvalidAssetError('Asset is invalid', issues)
  }
}

export class Asset {
  private constructor(private props: AssetProps) {}

  static create(input: CreateAssetInput, id = randomUUID()): Asset {
    return Asset.reconstitute({
      ...input,
      id,
      version: 1,
      name: input.name.trim(),
      notes: input.notes,
    })
  }

  static reconstitute(props: AssetProps): Asset {
    validateAssetProps(props)

    return new Asset({ ...props, name: props.name.trim() })
  }

  rename(name: string): void {
    this.replaceProps({
      ...this.props,
      name: name.trim(),
    })
  }

  changeType(type: AssetType): void {
    this.replaceProps({
      ...this.props,
      type,
    })
  }

  changeStatus(status: AssetStatus): void {
    this.replaceProps({
      ...this.props,
      status,
    })
  }

  relocate(lat: number, lng: number): void {
    this.replaceProps({
      ...this.props,
      lat,
      lng,
    })
  }

  changeInstallationDate(installedAt: string): void {
    this.replaceProps({
      ...this.props,
      installed_at: installedAt,
    })
  }

  changeLastInspectionDate(lastInspectedAt: string | null): void {
    this.replaceProps({
      ...this.props,
      last_inspected_at: lastInspectedAt,
    })
  }

  changeNotes(notes: string): void {
    this.replaceProps({
      ...this.props,
      notes,
    })
  }

  toPrimitives(): AssetProps {
    return { ...this.props }
  }

  private replaceProps(nextProps: AssetProps): void {
    validateAssetProps(nextProps)
    this.props = { ...nextProps, name: nextProps.name.trim() }
  }
}
