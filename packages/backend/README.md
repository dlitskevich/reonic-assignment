# Backend API

Node.js backend with Express, TypeScript, Prisma, and GraphQL. Implements **Task 2b** from the assignment.

## Installation

### Prerequisites

- Node.js 24.0 or higher
- pnpm 8.0 or higher (or npm/yarn)
- PostgreSQL database

### Setup

1. **Install dependencies** (from project root or this directory):

```bash
pnpm install
```

2. **Set up environment variables**:

Create a `.env` file in the `packages/backend` directory:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"
PORT=4000
```

Replace the `DATABASE_URL` with your PostgreSQL connection string.

3. **Set up the database**:

```bash
# Generate Prisma Client
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate
```

This will create all necessary tables in your PostgreSQL database.

4. **Start the development server**:

```bash
pnpm dev
```

The server will start on `http://localhost:4000` and GraphQL endpoint will be available at `http://localhost:4000/graphql`.

## Scripts

- `pnpm dev` - Start development server with hot reload (using `tsx watch`)
- `pnpm prisma:generate` - Generate Prisma Client from schema
- `pnpm prisma:migrate` - Run database migrations (development mode)
- `pnpm prisma:studio` - Open Prisma Studio (database GUI for browsing data)

## Project Structure

```
packages/backend/
├── src/
│   ├── index.ts                    # Express server entry point
│   ├── graphql/
│   │   ├── typeDefs.ts            # GraphQL schema definitions
│   │   ├── resolvers.ts           # GraphQL resolvers entry point
│   │   └── resolvers/
│   │       └── runSimulation.ts   # Simulation mutation resolver
│   └── utils/
│       ├── simulation.ts          # Mock simulation logic
│       └── types.ts               # Shared TypeScript types
├── prisma/
│   ├── schema.prisma              # Prisma schema (database models)
│   └── migrations/                # Database migration files
└── generated/
    └── prisma/                    # Generated Prisma Client
```

## GraphQL API

The GraphQL endpoint is available at `/graphql`. You can test it using:

- GraphQL Playground (if enabled)
- Apollo Studio
- Any GraphQL client

### Schema Overview

#### Queries

- `hello: String` - Simple health check
- `simulationParameters: [SimulationParameter!]!` - Get all simulation parameters
- `simulationParameter(id: Int!): SimulationParameter` - Get a specific simulation parameter

#### Mutations

- `createSimulationParameter(input: SimulationParameterInput!): SimulationParameter!` - Create new simulation parameters
- `updateSimulationParameter(id: Int!, input: SimulationParameterInput!): SimulationParameter!` - Update existing parameters
- `deleteSimulationParameter(id: Int!): Boolean!` - Delete simulation parameters
- `runSimulation(input: SimulationParameterInput!): SimulationResult!` - Run simulation and store results

### Example Queries

#### Run Simulation

```graphql
mutation {
  runSimulation(
    input: {
      chargepoints: [{ count: 20, powerKw: 11.0 }]
      consumptionKwhPer100km: 18.0
      days: 365
      intervalMinutes: 15
      arrivalProbabilityMultiplier: 100
    }
  ) {
    id
    totalEnergyKwh
    maxPowerKw
    maxTheoreticalPowerKw
    concurrencyFactor
    aggregatedDailyData {
      dailyStats {
        avg
        max
        min
      }
      intervalDataPoints {
        time
        avg
        max
        min
      }
    }
    powerHistogram {
      maxPowerKw
      count
      percentage
    }
  }
}
```

## Implementation Highlights

### Task 2b Requirements ✓

1. **CRUD Operations for Simulation Parameters**

   - ✅ Create: `createSimulationParameter` mutation
   - ✅ Read: `simulationParameters` and `simulationParameter` queries
   - ✅ Update: `updateSimulationParameter` mutation
   - ✅ Delete: `deleteSimulationParameter` mutation

2. **Input Parameters Stored**

   - ✅ Number of chargepoints (with support for multiple types - **bonus feature**)
   - ✅ Arrival probability multiplier (20-200%, default: 100%)
   - ✅ Consumption rate (default: 18 kWh per 100km)
   - ✅ Charging power per chargepoint (default: 11 kW)
   - ✅ Simulation duration (days)
   - ✅ Interval resolution (minutes)

3. **Simulation Execution**

   - ✅ `runSimulation` mutation executes mock simulation
   - ✅ Results are persisted to database
   - ✅ Automatic parameter deduplication (reuses existing parameters if identical)

4. **Output Storage**
   - ✅ Total energy charged (kWh)
   - ✅ Maximum power demand (kW)
   - ✅ Theoretical maximum power (kW)
   - ✅ Concurrency factor
   - ✅ Aggregated daily data with statistics
   - ✅ Interval-level data points for daily patterns
   - ✅ Power distribution histogram

### Bonus Features Implemented

1. **Multiple Chargepoint Types** ✓

   - Support for heterogeneous chargepoint configurations
   - Example: 5 × 11kW, 3 × 22kW, 1 × 50kW
   - Properly calculates aggregated theoretical maximum power

2. **Rich Data Aggregation**

   - Daily statistics (avg, max, min)
   - Interval-level data points showing patterns across the day
   - Power histogram for distribution analysis

3. **Parameter Deduplication**
   - Automatically detects and reuses existing parameters
   - Reduces database bloat
   - Links multiple simulation results to same parameter set

## Database Schema

### Models

- **SimulationParameter**: Input parameters for simulations

  - Supports multiple chargepoint configurations (one-to-many)
  - Links to simulation results (one-to-many)

- **Chargepoint**: Individual chargepoint configuration

  - Count and power rating
  - Belongs to a SimulationParameter

- **SimulationResult**: Output from a simulation run

  - Links to SimulationParameter (optional, for tracking)
  - Contains aggregated metrics

- **AggregatedDailyData**: Daily aggregation data

  - Contains daily statistics
  - Contains interval data points

- **DailyStats**: Statistical summary (avg, max, min)

- **IntervalDataPoint**: Per-interval statistics within a day

  - Time of day
  - Average, maximum, minimum values

- **PowerHistogramDataPoint**: Power distribution histogram
  - Power bins with counts and percentages
