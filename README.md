# Asset Map

Small full-stack asset map app with React, Redux Toolkit, Express, TypeORM, and PostGIS.

![alt text](image.png)

## First Run

```sh
npm --prefix api install
npm --prefix web install
cp api/.env.example api/.env
docker compose up -d postgis
npm --prefix api run migration:run
npm --prefix api run seed
```

## Run Locally

In two terminals:

```sh
npm --prefix api run dev
npm --prefix web run dev
```

API defaults to `http://127.0.0.1:4000`; Vite defaults to `http://127.0.0.1:5173`.

## Checks

```sh
npm --prefix api run build
npm --prefix api run lint
npm --prefix api run format:check
npm --prefix api test
RUN_DB_TESTS=true npm --prefix api test
npm --prefix api run schema:log

npm --prefix web run build
npm --prefix web run lint
npm --prefix web test
```

## Notes

Technical choices live in [TECHNICAL_DECISIONS.md](TECHNICAL_DECISIONS.md).
Short history lives in [CHANGELOG.md](CHANGELOG.md).
