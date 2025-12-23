# EV Charging Station Simulation

This package contains the core simulation logic for modeling EV charging station behavior over time. It implements **Task 1** from the assignment.

## Installation

### Prerequisites

- Python 3.14 or higher
- pip (Python package manager)

### Setup

1. Navigate to the simulation package directory:

```bash
cd packages/simulation
```

2. Install the package and its dependencies:

```bash
pip3 install -e .
```

This installs the package in editable mode along with dependencies:

- `numpy>=1.24.0` - Numerical computations
- `matplotlib>=3.7.0` - Plotting and visualization

## Usage

### Basic Simulation

Run a simulation with default parameters (20 chargepoints, 11kW each, 365 days):

```bash
python3 main.py
```

#### Custom Parameters

Run with custom parameters:

```bash
python3 main.py --chargepoints 20 --power 11.0 --consumption 18.0 --days 365 --arrival-multiplier 1
```

**Arguments:**

- `--chargepoints`: Number of chargepoints (default: 20)
- `--power`: Power per chargepoint in kW (default: 11.0)
- `--consumption`: Vehicle consumption in kWh per 100km (default: 18.0)
- `--days`: Number of days to simulate (default: 365)
- `--arrival-multiplier`: Multiplier for the arrival probability (default: 1)

#### Output

The simulation outputs:

- Total energy consumed (kWh)
- Actual maximum power demand (kW)
- Theoretical maximum power demand (kW)
- Concurrency factor (ratio of actual to theoretical max)

A power history histogram is saved to `output/power_history.png`.

### Concurrency Factor Analysis

Run the concurrency factor analysis:

```bash
python3 concurrency_factor.py
```

#### Output

The concurrency factor analysis outputs:

- Concurrency factor behavior across 1-30 chargepoints
- With and without seeding

A plot of the concurrency factor behavior across 1-30 chargepoints is saved to `output/concurrency_factor.png`. And for seeded version -- `output/concurrency_factor_42.png`.

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

### Bonus Features Implemented

1. **Concurrency Factor Analysis**

   - Ability to analyze concurrency factor behavior across 1-30 chargepoints
   - Helps understand how utilization changes with scale

2. **Seed Support for Deterministic Results**

   - Optional seeding for reproducible simulations
   - Useful for testing and validation

3. **DST Handling**

   - Daylight Saving Time was not included, as it does not affect annual energy consumption or peak power results at the yearly level.

   - While DST could shift charging activity by approximately one hour on individual days, this time shift does not materially change overall concurrency or infrastructure sizing outcomes.

## Architecture

### Key Components

- **`simulation/simulator.py`**: Core simulation engine
  - Manages chargepoint states
  - Handles EV arrivals and departures
  - Calculates power consumption over time
- **`simulation/distributions.py`**: Probability distributions
  - Arrival probability distributions (hourly patterns)
  - Charging need distributions (distance-based energy requirements)
- **`simulation/chargepoint.py`**: Chargepoint model
  - State management (idle, charging)
  - Charging session tracking
- **`simulation/vehicle.py`**: Vehicle model

  - Energy requirements calculation
  - Charging time computation

- **`main.py`**: CLI entry point

  - Argument parsing
  - Result display
  - Visualization generation

- **`concurrency_factor.py`**: Concurrency factor analysis
  - Analysis of concurrency factor behavior across 1-30 chargepoints
  - With and without seeding

## Testing

Run the test suite:

```bash
pytest
```
