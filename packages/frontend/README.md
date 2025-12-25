# Frontend Application

React + TypeScript + Tailwind CSS frontend application for visualizing EV charging station simulations. Implements **Task 2a** from the assignment.

## Installation

### Prerequisites

- Node.js 24.0 or higher
- pnpm 8.0 or higher (or npm/yarn)
- Setup backend (see `packages/backend/README.md`)

### Setup

1. **Install dependencies** (from project root or this directory):

```bash
pnpm install
```

2. **Configure backend URL** (if needed):

The frontend expects the backend API at `http://localhost:4000/graphql` by default. To change this, update `src/apollo/client.ts`.

3. **Start the development server**:

```bash
pnpm dev
```

Or from the project root:

```bash
pnpm dev:frontend
```

The application will be available at `http://localhost:5173` (Vite's default port).

4. **Generate GraphQL types**:

```bash
pnpm codegen
```

This will generate the GraphQL types in the `src/types` directory.

## Tech Stack

- **React 18** - UI library with hooks
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Apollo Client** - GraphQL client for data fetching
- **Recharts** - Charting library for visualizations
- **GraphQL Code Generator** - Generate GraphQL types from schema

## Project Structure

```
packages/frontend/
├── src/
│   ├── App.tsx                        # Main application component
│   ├── main.tsx                       # Application entry point
│   ├── index.css                      # Global styles
│   ├── types/__generated__/graphql.ts # GraphQL types
│   ├── apollo/
│   │   └── client.ts                  # Apollo Client configuration
│   ├── components/
│   │   ├── ParameterInput.tsx         # Parameter configuration form
│   │   ├── ChargepointConfig.tsx      # Chargepoint configuration (bonus)
│   │   ├── StatisticsDisplay.tsx      # Key metrics display
│   │   ├── AggregatedDailyDataChart.tsx  # Daily pattern chart
│   │   ├── PowerDistributionChart.tsx    # Power histogram chart
│   │   ├── Sidebar.tsx                # Responsive sidebar
│   │   └── RangeSlider/               # Custom range slider component
│   ├── graphql/
│   │   └── useRunSimulation.ts        # GraphQL mutation hook
│   └── utils/
│       └── urlParams.ts               # URL parameter serialization
├── index.html                         # HTML template
├── vite.config.ts                     # Vite configuration
├── tailwind.config.js                 # Tailwind configuration
└── tsconfig.json                      # TypeScript configuration
```

## Features

### Core Features (Task 2a)

1. **Parameter Configuration**

   - Number of chargepoints
   - Arrival probability multiplier (20-200%, default: 100%)
   - Vehicle consumption (default: 18 kWh per 100km)
   - Charging power per chargepoint (default: 11 kW)
   - Simulation duration (days)
   - Interval resolution (minutes)

2. **Visualizations**
   - ✅ Exemplary day pattern (aggregated daily data chart)
   - ✅ Power distribution histogram
   - ✅ Total energy charged (kWh) in statistics display
   - ✅ Maximum power metrics
   - ✅ Concurrency factor display

### Bonus Features Implemented

1. **Multiple Chargepoint Types** ✓

   - UI to create different types of chargepoints
   - Example: 5 × 11kW, 3 × 22kW, 1 × 50kW
   - Dynamic add/remove chargepoint configurations
   - Real-time calculation of total chargepoints and max theoretical power

2. **URL Parameter Persistence**

   - Simulation parameters are stored in URL query parameters
   - Shareable links with pre-configured parameters
   - Browser back/forward navigation support

3. **Responsive Design**

   - Mobile-friendly layout with collapsible sidebar
   - Desktop-optimized multi-column layout
   - Touch-friendly controls

4. **Enhanced Visualizations**
   - Interactive charts with tooltips
   - Multiple chart types (line, bar, area)
   - Color-coded data series
   - Responsive chart sizing

## Follow-ups & Future Improvements

### Immediate Enhancements

1. **Error Handling**

   - User-friendly error messages
   - Error boundaries for graceful failures
   - Retry mechanisms for failed requests

2. **Loading States**

   - Skeleton loaders during data fetch
   - Progress indicators for long-running simulations
   - Optimistic UI updates

3. **Input Validation**

   - Real-time validation feedback
   - Prevent invalid configurations
   - Helpful error messages

4. **Accessibility**

   - ARIA labels and roles
   - Keyboard navigation
   - Screen reader support
   - Focus management

5. **Testing**
   - Increase test coverage
