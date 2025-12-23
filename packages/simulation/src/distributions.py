"""Probability distributions for EV arrival and charging needs."""

import numpy as np


def arrival_probability(hour: int) -> float:
    """
    Calculate arrival probability (within 1 hour interval) T1 for a given hour of the day.

    Args:
        hour: Hour of the day (0-23)

    Returns:
        Probability of arrival (0.0 to 1.0)
    """
    if hour >= 0 and hour < 8:
        return 0.0094
    if hour < 10:
        return 0.0283
    if hour < 13:
        return 0.0566
    if hour < 16:
        return 0.0755
    if hour < 19:
        return 0.1038
    if hour < 22:
        return 0.0472
    if hour < 24:
        return 0.0094
    raise ValueError(f"Invalid hour: {hour}")


def sample_charging_needs_km() -> int:
    """
    Sample charging needs based on vehicle consumption.

    Returns:
        Sampled distance in km
    """
    km = [0, 5, 10, 20, 30, 50, 100, 200, 300]
    probabilities = np.array(
        [0.3431, 0.049, 0.098, 0.1176, 0.0882, 0.1176, 0.1078, 0.049, 0.0294]
    )

    return np.random.choice(km, p=probabilities / probabilities.sum())


def sample_charging_energy(consumption_kwh_per_100km: float = 18.0) -> float:
    """
    Sample charging energy based on vehicle consumption.

    Args:
        consumption_kwh_per_100km: Vehicle consumption in kWh per 100km (default: 18)

    Returns:
        Sampled energy in kWh
    """
    return sample_charging_needs_km() / 100 * consumption_kwh_per_100km


def sample_arrival(hour: int, interval_minutes: int, arrival_multiplier: float) -> bool:
    """
    Sample whether an arrival occurs in a given hour.

    Note: doesn't account for the intervals spanning multiple hours.

    Args:
        hour: Hour of the day (0-23)
        interval_minutes: Length of the interval in minutes
        arrival_multiplier: Multiplier for the arrival probability
    Returns:
        True if arrival occurs, False otherwise
    """
    probability = arrival_probability(hour)
    return (
        np.random.random() < probability * (interval_minutes / 60) * arrival_multiplier
    )
