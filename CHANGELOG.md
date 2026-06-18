# Changelog

Compact notes on decisions and meaningful changes. Keep entries dated, short, and written for a human reviewer.

## 2026-06-18

- Reviewed the asset query indexes against the real list endpoints.
- Kept the primary key for single-asset reads/writes, GiST on `location` for bbox search, `(type, status)` for combined filters, and `name` for name sorting.
- Added an append-only migration for production list performance: `(status, name)` for status-only filtering and a status-rank expression index for default severity sorting.
- Created those new indexes concurrently and marked that migration non-transactional to avoid blocking writes on larger tables.
- Kept `Asset.create` for new assets and `Asset.reconstitute` for loading existing persisted assets.
- Replaced the public generic asset `update` method with fine-grained domain methods such as `rename`, `changeStatus`, and `relocate`.
- Added an Express backend in `api/` instead of mixing backend code into `web/`.
- Chose explicit controller -> application service/CQRS handler -> domain -> repository layering.
- Kept domain code independent from Express and TypeORM.
- Made repositories interfaces injected into application handlers, with TypeORM as the first adapter.
- Chose PostgreSQL/PostGIS with TypeORM spatial `geometry(Point, 4326)` storage.
- Disabled TypeORM schema sync; schema changes go through migrations only.
- Added known domain/business errors plus a global fallback error handler.
- Versioned API under `/api/v1`.
- Switched frontend RTK Query from in-memory mock data to the real API.
- Moved list pagination to the server response: `{ items, total, limit, offset }`.

## 2026-06-17

- Kept Redux for client UI state and RTK Query for server data/cache ownership.
- Removed name search from the core flow because the assignment only asks for type/status and geographic filtering.
- Kept the map-area search explicit: panning does not refetch automatically; clicking “Search this area” commits the current bounds.
- Kept “Clear area filter” as the way back to all assets matching type/status filters.

## 2026-06-16

- Started the frontend as a feature-based React structure inspired by Bulletproof React.
- Chose Tailwind with theme tokens from `web/DESIGN.md`.
- Added Redux Toolkit store and asset UI slice for filters, selection, modals, pagination, and map bounds.
- Used smart/dumb component pairs for asset screens so handlers/data stay separate from presentation.
- Adapted Stitch HTML only where useful; kept visual polish separate from state and data plumbing.
