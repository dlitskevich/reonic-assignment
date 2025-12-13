import matplotlib.pyplot as plt
import numpy as np
from simulation.simulator import Simulator


def main(seed=None):
    if seed is not None:
        np.random.seed(seed)
    max_num_chargepoints = 30
    power_per_chargepoint_kw = 11.0
    consumption_kwh_per_100km = 18.0
    days = 365
    concurrency_factors = []
    max_theoretical_powers = []
    max_powers = []

    for num_chargepoints in range(1, max_num_chargepoints + 1):
        simulator = Simulator(
            num_chargepoints=num_chargepoints,
            power_per_chargepoint_kw=power_per_chargepoint_kw,
            consumption_kwh_per_100km=consumption_kwh_per_100km,
            days=days,
        )
        results = simulator.run()
        print(
            f"Number of chargepoints: {num_chargepoints}, Concurrency factor: {results['concurrency_factor']:.2f}"
        )
        concurrency_factors.append(results["concurrency_factor"])
        max_theoretical_powers.append(results["max_theoretical_power_kw"])
        max_powers.append(results["max_power_kw"])

    plt.plot(range(1, max_num_chargepoints + 1), concurrency_factors, label="Concurrency factor")
    plt.legend()
    plt.xticks(range(1, max_num_chargepoints + 1, max_num_chargepoints // 5))
    plt.savefig(f"output/concurency_factor_{seed if seed is not None else 'random'}.png")
    plt.close()


if __name__ == "__main__":
    main()
    main(seed=42)
