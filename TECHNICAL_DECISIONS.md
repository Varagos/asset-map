# Technical Decisions

Compact notes for reviewers. Details and timeline live in [CHANGELOG.md](CHANGELOG.md).

## Frontend

- Feature-based React structure inspired by Bulletproof React.
- Smart/container components own data, handlers, and Redux wiring.
- Dumb/view components stay presentational and easier to reuse/test.
- Redux stores client UI state: filters, selection, modals, pagination, map bounds.
- RTK Query owns server data, caching, invalidation, and API requests.
- React Hook Form keeps form state local, not in Redux.
- Zod validates asset create/edit forms before submit.
- Type/status filters apply to both list and map.
- Pagination is server-side via `{ items, total, limit, offset }`.
- Header totals use a dedicated summary endpoint, not a high-limit list query.
- Create/edit location picking uses Leaflet; form state remains in React Hook Form.
- Delete uses a dedicated destructive confirmation modal.
- Map-area search is explicit: pan/zoom shows "Search this area"; it does not refetch automatically.
- Tailwind is used with project theme tokens from `web/DESIGN.md`.

## Backend

- Express API is versioned under `/api/v1`.
- Layering is controller -> application command/query handlers -> domain -> repository.
- Domain entities stay independent from Express and TypeORM.
- Repositories are interfaces injected into application handlers.
- TypeORM is the first repository adapter.
- PostgreSQL/PostGIS stores coordinates as `geometry(Point, 4326)`.
- Schema changes use migrations only; TypeORM sync stays disabled.
- `schema:log` is used as a non-mutating drift check.
- Known domain/business errors map to stable API errors.
- Unknown errors fall back to generic `500`.

## Data And Consistency

- Seed data loads into Postgres through the backend repository.
- Asset summary counts are aggregated server-side.
- Last inspected date must be empty/null or on/after installed date.
- Bbox filtering is inclusive so edge markers remain visible.
- GiST spatial index supports geographic filtering.
- List indexes support type/status filtering and default status sorting.
- Asset writes use optimistic concurrency.
- TypeORM `@VersionColumn` tracks asset versions.
- HTTP `ETag`/`If-Match` carries the edited version.
- PATCH and DELETE require `If-Match`.
- Stale writes return `412 Precondition Failed`.

## Testing

- Domain tests cover entity validation and update methods.
- Application tests use fake repositories.
- HTTP schema tests cover request parsing and validation.
- Supertest covers API behavior.
- PostGIS repository tests run with `RUN_DB_TESTS=true`.
- Frontend tests cover filters, bbox utilities, schemas, and rendered asset lists.
