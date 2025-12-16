"""Vehicle module for the simulation."""


class Vehicle:
    """Represents a vehicle with charging needs."""

    def __init__(self, charging_demand: float):
        self.left_to_charge = charging_demand

    def charge(self, energy_kwh: float) -> float:
        """Charge the vehicle with specified energy."""
        if not self.is_charging():
            raise ValueError("Vehicle is not charging")

        energy_kwh = min(energy_kwh, self.left_to_charge)
        self.left_to_charge -= energy_kwh
        return energy_kwh

    def is_charging(self) -> bool:
        return self.left_to_charge > 0
