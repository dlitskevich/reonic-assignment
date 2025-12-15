"""Main entry point for running the EV charging station simulation."""

import argparse
import sys
import matplotlib.pyplot as plt
from pathlib import Path

# Add parent directory to path to allow imports when running directly
sys.path.insert(0, str(Path(__file__).parent))

from simulation.simulator import Simulator


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

    args = parser.parse_args()

    # Run simulation
    print(f"Starting simulation with {args.chargepoints} chargepoints...")
    print(f"  Power: {args.power} kW per chargepoint")
    print(f"  Consumption: {args.consumption} kWh/100km")
    print(f"  Duration: {args.days} days")
    print()

    simulator = Simulator(
        num_chargepoints=args.chargepoints,
        power_per_chargepoint_kw=args.power,
        consumption_kwh_per_100km=args.consumption,
        days=args.days,
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


if __name__ == "__main__":
    main()
