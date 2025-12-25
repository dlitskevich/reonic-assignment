"""Main entry point for running the EV charging station simulation."""

import argparse
from collections import defaultdict
import sys
import time
import matplotlib.pyplot as plt
from pathlib import Path

# Add parent directory to path to allow imports when running directly
sys.path.insert(0, str(Path(__file__).parent))

from src.simulator import Simulator


def run_simulation(
    chargepoints: int,
    power: float,
    consumption: float,
    days: int,
    arrival_multiplier: float,
    interval_minutes: int,
):
    print(f"Starting simulation with {chargepoints} chargepoints...")
    print(f"  Power: {power} kW per chargepoint")
    print(f"  Consumption: {consumption} kWh/100km")
    print(f"  Duration: {days} days")
    print(f"  Arrival multiplier: {arrival_multiplier}")
    print(f"  Interval minutes: {interval_minutes}")
    print()

    simulator = Simulator(
        num_chargepoints=chargepoints,
        power_per_chargepoint_kw=power,
        consumption_kwh_per_100km=consumption,
        days=days,
        arrival_multiplier=arrival_multiplier,
        interval_minutes=interval_minutes,
    )

    results = simulator.run()

    print("Summary:")
    print(f"  Total energy delivered: {results['total_energy_kwh']:.0f} kWh")
    print(f"  Maximum power draw: {results['max_power_kw']:.0f} kW")
    print(f"  Max theoretical power: {results['max_theoretical_power_kw']:.0f} kW")
    print(f"  Concurrency factor: {results['concurrency_factor']:.2f}")

    plt.hist(results["power_history"], bins=24)
    path = Path(__file__).parent / "output" / "power_history.png"
    path.parent.mkdir(parents=True, exist_ok=True)
    plt.savefig(path)
    plt.close()


def average_simulation(
    chargepoints: int,
    power: float,
    consumption: float,
    days: int,
    arrival_multiplier: float,
    interval_minutes: int,
):
    time_start = time.time()
    concurrency_factors = defaultdict(int)
    for _ in range(100):
        simulator = Simulator(
            num_chargepoints=chargepoints,
            power_per_chargepoint_kw=power,
            consumption_kwh_per_100km=consumption,
            days=days,
            arrival_multiplier=arrival_multiplier,
            interval_minutes=interval_minutes,
        )
        results = simulator.run()
        concurrency_factors[results["concurrency_factor"]] += 1

    for concurrency_factor, count in sorted(concurrency_factors.items()):
        print(f"Concurrency factor: {concurrency_factor:.2f}, Count: {count}")
    time_end = time.time()
    print(f"Time taken: {time_end - time_start:.2f} seconds")


def main():
    """CLI entry point for simulation."""
    parser = argparse.ArgumentParser(
        description="EV Charging Station Simulation",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--chargepoints",
        type=int,
        default=20,
        help="Number of chargepoints (default: 20)",
    )
    parser.add_argument(
        "--power",
        type=float,
        default=11.0,
        help="Power per chargepoint in kW (default: 11.0)",
    )
    parser.add_argument(
        "--consumption",
        type=float,
        default=18.0,
        help="Vehicle consumption in kWh per 100km (default: 18.0)",
    )
    parser.add_argument(
        "--days",
        type=int,
        default=365,
        help="Number of days to simulate (default: 365)",
    )
    parser.add_argument(
        "--arrival-multiplier",
        type=float,
        default=1,
        help="Multiplier for the arrival probability (default: 1)",
    )
    parser.add_argument(
        "--interval-minutes",
        type=int,
        default=15,
        help="Interval minutes (default: 15)",
    )

    args = parser.parse_args()

    # Run simulation
    run_simulation(
        chargepoints=args.chargepoints,
        power=args.power,
        consumption=args.consumption,
        days=args.days,
        arrival_multiplier=args.arrival_multiplier,
        interval_minutes=args.interval_minutes,
    )

    average_simulation(
        chargepoints=args.chargepoints,
        power=args.power,
        consumption=args.consumption,
        days=args.days,
        arrival_multiplier=args.arrival_multiplier,
        interval_minutes=args.interval_minutes,
    )


if __name__ == "__main__":
    main()
