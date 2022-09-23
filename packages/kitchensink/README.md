# ForrestJS KitchenSink

This project collects many demonstrational apps - and E2E tests - for the services that are currently exposed by ForrestJS.

## Development

```bash
# Clean up, reinstall of all the dependencies, and link
npm run reset

# Start a specific project
npm run start:{service-name}
npm run test:{service-name}
```

## Postgres Services

Postgres services are configured so to use a local database as target for their job.

Please launch a postgres instance as:

```bash
docker run --rm -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres
```

The default connection string is:

```bash
PGSTRING=postgres://postgres:postgres@postgres:5432/postgres
```