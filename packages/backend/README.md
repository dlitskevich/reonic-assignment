# Backend Package

Node.js backend with Express, TypeScript, Prisma, and GraphQL.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your database connection string
```

3. Set up the database:

```bash
# Generate Prisma Client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate
```

4. Start the development server:

```bash
pnpm dev
```

The server will start on `http://localhost:4000` and GraphQL endpoint will be available at `http://localhost:4000/graphql`.

## Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm prisma:generate` - Generate Prisma Client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio (database GUI)
- `pnpm prisma:seed` - Seed the database

## Project Structure

```
src/
  ├── index.ts           # Express server entry point
  └── graphql/
      ├── typeDefs.ts    # GraphQL schema definitions
      └── resolvers.ts   # GraphQL resolvers
prisma/
  └── schema.prisma      # Prisma schema
```

## GraphQL

The GraphQL endpoint is available at `/graphql`. You can test it using GraphQL Playground or any GraphQL client.

Example query:

```graphql
query {
  hello
  users {
    id
    email
    name
  }
}
```

Example mutation:

```graphql
mutation {
  createUser(email: "test@example.com", name: "Test User") {
    id
    email
    name
  }
}
```
