# EV Charging Station Simulation (Rust)

This package contains the Rust implementation of the core simulation logic for modeling EV charging station behavior over time. It implements **Task 1** from the assignment.

## Installation

### Prerequisites

- Rust 1.70 or higher (install from [rustup.rs](https://rustup.rs/))
- Cargo (comes with Rust)

### Setup

1. Navigate to the simulation-rust package directory:

```bash
cd packages/simulation-rust
```

2. Build the project:

```bash
cargo build --release
```

This will download dependencies and compile the project:

- `rand` - Random number generation
- `clap` - Command-line argument parsing

## Usage

### Basic Simulation

Run a simulation with default parameters (20 chargepoints, 11kW each, 365 days):

```bash
cargo run --release
```

#### Custom Parameters

Run with custom parameters:

```bash
cargo run --release -- --chargepoints 20 --power 11.0 --consumption 18.0 --days 365 --arrival-multiplier 1.0 --interval-minutes 15
```

**Arguments:**

- `--chargepoints`: Number of chargepoints (default: 20)
- `--power`: Power per chargepoint in kW (default: 11.0)
- `--consumption`: Vehicle consumption in kWh per 100km (default: 18.0)
- `--days`: Number of days to simulate (default: 365)
- `--arrival-multiplier`: Multiplier for the arrival probability (default: 1.0)
- `--interval-minutes`: Interval minutes (default: 15)

#### Output

The simulation outputs:

- Total energy consumed (kWh)
- Actual maximum power demand (kW)
- Theoretical maximum power demand (kW)
- Concurrency factor (ratio of actual to theoretical max)

### Development

Run in development mode (faster compilation, slower execution):

```bash
cargo run
```

Run tests:

```bash
cargo test
```

Check code without building:

```bash
cargo check
```

Format code:

```bash
cargo fmt
```

Lint code:

```bash
cargo clippy
```

## Implementation Highlights

### Task 1 Requirements ✓

The implementation fulfills all core requirements:

1. **Simulation Logic**

   - Simulates multiple chargepoints (configurable, default 20)
   - 11kW power per chargepoint (configurable)
   - 15-minute intervals over one year (365 days = 35,040 ticks)

2. **Probability Distributions**

   - Arrival probability distribution (T1) - EV arrivals for each chargepoint independent of each other (as specified in the assignment)
   - Charging need distribution (T2) - models vehicle energy requirements
   - 18 kWh per 100km consumption assumption (configurable)

3. **Chargepoint Behavior**

   - Each chargepoint can only charge one EV at a time
   - EVs depart immediately after charging completion
   - Proper blocking/queuing logic

4. **Metrics Calculated**
   - ✅ Total energy consumed (kWh)
   - ✅ Theoretical maximum power demand
   - ✅ Actual maximum power demand
   - ✅ Concurrency factor (actual/max ratio)

## Architecture

### Key Components

- **`src/simulator.rs`**: Core simulation engine
  - Manages chargepoint states
  - Handles EV arrivals and departures
  - Calculates power consumption over time
- **`src/distributions.rs`**: Probability distributions
  - Arrival probability distributions (hourly patterns)
  - Charging need distributions (distance-based energy requirements)
- **`src/chargepoint.rs`**: Chargepoint model
  - State management (idle, charging)
  - Charging session tracking
- **`src/vehicle.rs`**: Vehicle model
  - Energy requirements calculation
  - Charging time computation
- **`src/main.rs`**: CLI entry point
  - Argument parsing
  - Result display

## Performance

The Rust implementation provides:

- **Memory safety** - No runtime errors from memory issues
- **Performance** - Compiled code runs efficiently
- **Type safety** - Compile-time guarantees about data correctness

## Comparison with Python Implementation

This Rust implementation is functionally equivalent to the Python version in `packages/simulation`, but offers:

- Better performance for large-scale simulations
- Compile-time type checking
- Memory safety guarantees
- No runtime dependency on Python interpreter
