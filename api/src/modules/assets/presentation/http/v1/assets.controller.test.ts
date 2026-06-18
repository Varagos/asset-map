import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../../../../../app'
import { createAssetsApplication } from '../../../application/assets.application'
import { Asset } from '../../../domain/asset.entity'
import { FakeAssetsRepository } from '../../../../../test/fake-assets.repository'

function createTestApp() {
  const repository = new FakeAssetsRepository([
    Asset.reconstitute({
      id: '17fc695a-07a0-4a6e-8822-e8f36c031199',
      version: 1,
      name: 'Sensor A',
      type: 'sensor',
      status: 'critical',
      lat: 10,
      lng: 10,
      installed_at: '2020-01-01',
      last_inspected_at: null,
      notes: '',
    }),
    Asset.reconstitute({
      id: 'cfe313dc-b092-4238-a56f-b3b5e477fdd0',
      version: 1,
      name: 'Valve B',
      type: 'valve',
      status: 'ok',
      lat: 30,
      lng: 30,
      installed_at: '2020-01-01',
      last_inspected_at: null,
      notes: '',
    }),
  ])

  return createApp({ assets: createAssetsApplication(repository) })
}

describe('assets controller', () => {
  it('lists filtered assets using the v1 response shape', async () => {
    const response = await request(createTestApp())
      .get('/api/v1/assets')
      .query({
        type: 'sensor',
        minLng: 9,
        minLat: 9,
        maxLng: 11,
        maxLat: 11,
      })
      .expect(200)

    expect(response.body).toMatchObject({
      total: 1,
      limit: 50,
      offset: 0,
      items: [{ name: 'Sensor A' }],
    })
  })

  it('returns the unfiltered assets summary', async () => {
    const response = await request(createTestApp())
      .get('/api/v1/assets/summary')
      .expect(200)

    expect(response.body).toEqual({
      total: 2,
      ok: 1,
      warning: 0,
      critical: 1,
    })
  })

  it('returns validation errors for invalid requests', async () => {
    const response = await request(createTestApp())
      .post('/api/v1/assets')
      .send({
        name: 'Invalid',
        type: 'sensor',
        status: 'ok',
        lat: 91,
        lng: -71,
        installed_at: '2020-01-01',
        last_inspected_at: null,
        notes: '',
      })
      .expect(400)
    const body = response.body as { error: { code: string } }

    expect(body.error.code).toBe('REQUEST_VALIDATION_FAILED')
  })

  it('creates, updates, and deletes an asset', async () => {
    const app = createTestApp()
    const created = await request(app)
      .post('/api/v1/assets')
      .send({
        name: 'Hydrant C',
        type: 'hydrant',
        status: 'warning',
        lat: 11,
        lng: 12,
        installed_at: '2022-01-01',
        last_inspected_at: null,
        notes: '',
      })
      .expect(201)
      .expect('ETag', '"1"')
    const createdBody = created.body as { id: string; version: number }

    const assetId = createdBody.id

    await request(app)
      .patch(`/api/v1/assets/${assetId}`)
      .set('If-Match', `"${createdBody.version}"`)
      .send({ status: 'critical' })
      .expect(200)
      .expect('ETag', '"2"')
      .expect((response) => {
        const body = response.body as { status: string }

        expect(body.status).toBe('critical')
      })

    await request(app)
      .delete(`/api/v1/assets/${assetId}`)
      .set('If-Match', '"2"')
      .expect(204)
    await request(app).get(`/api/v1/assets/${assetId}`).expect(404)
  })

  it('rejects stale asset updates', async () => {
    const app = createTestApp()

    await request(app)
      .patch('/api/v1/assets/17fc695a-07a0-4a6e-8822-e8f36c031199')
      .send({ status: 'ok' })
      .expect(428)

    await request(app)
      .patch('/api/v1/assets/17fc695a-07a0-4a6e-8822-e8f36c031199')
      .set('If-Match', '"0"')
      .send({ status: 'ok' })
      .expect(400)

    await request(app)
      .patch('/api/v1/assets/17fc695a-07a0-4a6e-8822-e8f36c031199')
      .set('If-Match', '"99"')
      .send({ status: 'ok' })
      .expect(412)
  })
})
