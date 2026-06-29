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
docker compose up -d
```

Connection string for `apps/web/.env.local`:

```env
DATABASE_URL="postgresql://wangbanghouse:wangbanghouse_dev_password@localhost:5432/wangbanghouse"
DEV_HOUSEHOLD_ID=""
DEV_WEDDING_PROJECT_ID=""
```

Open psql:

```bash
docker exec -it wangbanghouse-postgres psql -U wangbanghouse -d wangbanghouse
```

Migration SQL files live in `database/migrations`.

Apply migrations and seed the local development household/project:

```bash
pnpm db:setup
```

This creates or updates `apps/web/.env.local` with:

```env
DEV_HOUSEHOLD_ID="00000000-0000-4000-8000-000000000002"
DEV_WEDDING_PROJECT_ID="00000000-0000-4000-8000-000000000003"
```
