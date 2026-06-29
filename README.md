# WangBangHouse

Wedding Planning MVP for WangBangHouse.

## Development

```bash
pnpm install
pnpm dev
```

## PostgreSQL

Start the local database:

```bash
cp .env.example .env
docker compose up -d
```

Create the app env file:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Use the same local PostgreSQL password in root `.env` and `apps/web/.env.local`.

Open psql:

```bash
docker exec -it wangbanghouse-postgres psql -U wangbanghouse -d wangbanghouse
```

Check container health:

```bash
docker compose ps
```

Migration SQL files live in `database/migrations`.

Apply migrations and prepare the local development database:

```bash
pnpm db:setup
```

This creates or updates `apps/web/.env.local` with the database connection.
