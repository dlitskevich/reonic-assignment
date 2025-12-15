"""Main simulation engine for EV charging stations."""

from math import ceil
from typing import Dict, List

from simulation.chargepoint import Chargepoint
from simulation.vehicle import Vehicle
from simulation.distributions import sample_arrival, sample_charging_energy


class Simulator:
    """Main simulation engine that runs 20 chargepoints for 1 year."""

    def __init__(
        self,
        num_chargepoints: int = 20,
        power_per_chargepoint_kw: float = 11.0,
        consumption_kwh_per_100km: float = 18.0,
        days: int = 365,
        interval_minutes: int = 15,
    ):
        """
        Initialize the simulator.

        Args:
            num_chargepoints: Number of chargepoints to simulate
            power_per_chargepoint_kw: Power capacity per chargepoint in kW
            consumption_kwh_per_100km: Vehicle consumption in kWh per 100km
            days: Number of days to simulate
            interval_minutes: Duration of each time interval in minutes
        """
        self.num_chargepoints = num_chargepoints
        self.power_per_chargepoint_kw = power_per_chargepoint_kw
        self.consumption_kwh_per_100km = consumption_kwh_per_100km
        self.days = days
        self.interval_minutes = interval_minutes

        self.chargepoints = [
            Chargepoint(power_per_chargepoint_kw) for _ in range(num_chargepoints)
        ]
        self.power_history: List[float] = []
        self.total_energy = 0.0

    def run(self) -> Dict:
        """
        Run the simulation.

        Returns:
            Dictionary containing simulation results
        """
        total_intervals = ceil((self.days * 24 * 60) / self.interval_minutes)

        # Add one extra interval to account for the last interval (we start from 0 for the first interval set up)
        for interval_idx in range(total_intervals + 1):
            # Determine hour of day for arrival probability
            hour = ((interval_idx * self.interval_minutes) // 60) % 24

            # Perform charging step for all chargepoints
            interval_energy = self._charge_step()
            # self._arrival_step(hour) # according to the description, that is not the case
            self._arrival_each_chargepoint_step(
                hour
            )  # models arrival for each chargepoint independently
            power_demand = 0
            for chargepoint in self.chargepoints:
                if chargepoint.is_charging():
                    power_demand += chargepoint.power_kw

            self.total_energy += interval_energy
            self.power_history.append(power_demand)

        max_power = max(self.power_history)
        max_theoretical_power = self.num_chargepoints * self.power_per_chargepoint_kw
        return {
            "total_energy_kwh": self.total_energy,
            "max_power_kw": max_power,
            "max_theoretical_power_kw": max_theoretical_power,
            "concurrency_factor": max_power / max_theoretical_power,
            "power_history": self.power_history,
        }

    def _charge_step(self) -> float:
        """
        Perform one charging step for all chargepoints.

        Returns:
            Energy delivered in kWh for all chargepoints in the interval
        """
        energy_delivered = 0.0
        interval_minutes = self.interval_minutes
        for chargepoint in self.chargepoints:
            vehicle: Vehicle | None = chargepoint.vehicle
            if vehicle is None:
                continue
            energy_delivered += vehicle.charge(
                chargepoint.power_kw * (interval_minutes / 60)
            )

            if not vehicle.is_charging():
                chargepoint.vehicle = None

        return energy_delivered

    def _arrival_step(self, hour: int) -> float:
        """
        Perform one arrival step for all chargepoints.
        """
        if not sample_arrival(hour):
            return

        energy_needed = sample_charging_energy(self.consumption_kwh_per_100km)

        if energy_needed == 0:
            return

        chargepoint = next((c for c in self.chargepoints if c.vehicle is None), None)

        if chargepoint is None:
            return
        chargepoint.vehicle = Vehicle(energy_needed)

    def _arrival_each_chargepoint_step(self, hour: int) -> float:
        """
        Perform one arrival step for each chargepoint.
        """
        for chargepoint in self.chargepoints:
            if chargepoint.vehicle is None:
                if sample_arrival(hour):
                    energy_needed = sample_charging_energy(
                        self.consumption_kwh_per_100km
                    )
                    if energy_needed > 0:
                        chargepoint.vehicle = Vehicle(energy_needed)
