"""Chargepoint model for EV charging simulation."""

from simulation.vehicle import Vehicle


class Chargepoint:
    """Represents a single EV charging point with 11kW power capacity."""

    def __init__(self, power_kw: float = 11.0):
        """
        Initialize a chargepoint.

        Args:
            power_kw: Maximum charging power in kW (default: 11.0)
        """
        self.power_kw = power_kw
        self.vehicle: Vehicle | None = None

    def is_charging(self) -> bool:
        """
        Check if the chargepoint is charging a vehicle.

        Returns:
            True if the chargepoint is charging a vehicle, False otherwise
        """
        return self.vehicle is not None and self.vehicle.is_charging()
