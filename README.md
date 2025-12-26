# EV Charging Station Simulation

## Overview

### Simulations (Task 1)

- Discrete event simulation over 15-minute intervals
- Calculates total energy, peak power, and concurrency factor
- Bonus: Concurrency factor analysis across 1-30 chargepoints

### Frontend UI (Task 2a)

- Interactive parameter configuration
- Visualizations: daily patterns, power distribution, statistics
- Bonus: Multiple chargepoint types UI, URL parameter sharing

### Backend API (Task 2b)

- GraphQL API with CRUD operations for simulation parameters
- PostgreSQL database with Prisma ORM
- Simulation execution endpoint with result persistence

## Documentation

For detailed documentation, see individual package READMEs:

- [`packages/simulation/README.md`](packages/simulation/README.md) - Simulation engine details
- [`packages/backend/README.md`](packages/backend/README.md) - API documentation and schema
- [`packages/frontend/README.md`](packages/frontend/README.md) - Frontend components and usage

## Tech Stack

**Simulation:**

- Python 3.14+
- NumPy, Matplotlib

- Rust

**Backend:**

- Node.js 24+
- TypeScript
- Express
- Apollo Server (GraphQL)
- Prisma ORM
- PostgreSQL
- GraphQL Code Generator

**Frontend:**

- React 18
- TypeScript
- Tailwind CSS
- Apollo Client
- Recharts
- Vite
- GraphQL Code Generator

## Prerequisites

- **Node.js** 24.0 or higher
- **pnpm** 8.0 or higher
- **PostgreSQL** database
- **Python** 3.14 or higher
- **pip** (Python package manager)

## Quick Start Simulations (Task 1)

```bash
cd packages/simulation
# Install the dependencies
pip3 install -e .
# Run the simulation
python3 main.py
```

## Quick Start Rust Simulation (Task 1)

Note: Rust simulation is faster than Python simulation ~40 times.

```bash
cd packages/simulation-rust
# Install the dependencies
cargo build --release
# Run the simulation
cargo run --release
```

## Quick Start Backend and Frontend (Tasks 2a and 2b)

### 1. Clone and Install Dependencies

```bash
# Install Node.js dependencies for all packages
pnpm install
```

### 2. Set Up Database

```bash
# Navigate to backend package
cd packages/backend

# Create .env file with your database connection
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"' > .env
# Edit .env with your actual database credentials

# Generate Prisma Client and run migrations
pnpm prisma:generate
pnpm prisma:migrate

cd ../..
```

### 3. Run the Application

**Terminal 1 - Backend:**

```bash
pnpm dev:backend
```

Backend runs on `http://localhost:4000`

**Terminal 2 - Frontend:**

```bash
pnpm dev:frontend
```

Frontend runs on `http://localhost:5173`

Open `http://localhost:5173` in your browser to use the application.

## Project Structure

```
reonic_assignment/
├── packages/
│   ├── simulation/          # Python simulation engine (Task 1)
│   │   ├── simulation/      # Core simulation logic
│   │   ├── main.py          # CLI entry point
│   │   └── concurrency_factor.py  # Bonus: concurrency analysis
│   ├── simulation-rust/     # Rust simulation engine (Task 1)
│   │   └── src/             # Rust source code
│   ├── backend/             # Node.js GraphQL API (Task 2b)
│   │   ├── src/
│   │   │   ├── graphql/     # GraphQL schema and resolvers
│   │   │   └── utils/       # Mock simulation logic
│   │   └── prisma/          # Database schema and migrations
│   │
│   └── frontend/            # React web application (Task 2a)
│       └── src/
│           ├── components/  # UI components
│           ├── graphql/     # GraphQL client hooks
│           └── utils/       # URL parameter utilities
│
├── package.json             # Root package.json (monorepo config)
└── pnpm-workspace.yaml      # pnpm workspace configuration
```

## Available Scripts

From the root directory:

- `pnpm dev:frontend` - Start frontend development server
- `pnpm dev:backend` - Start backend development server
- `pnpm test` - Run tests across all packages
