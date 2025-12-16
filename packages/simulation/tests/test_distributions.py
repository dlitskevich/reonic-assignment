"""Tests for probability distributions."""

import pytest

from src.distributions import (
    arrival_probability,
    sample_charging_energy,
    sample_charging_needs_km,
)


def test_arrival_probability():
    """Test that arrival probability is between 0 and 1."""
    for hour in range(24):
        prob = arrival_probability(hour)
        assert 0.0 <= prob <= 1.0


def test_arrival_probability_invalid_hour():
    """Test that arrival_probability raises ValueError for invalid hours."""
    with pytest.raises(ValueError):
        arrival_probability(24)
    with pytest.raises(ValueError):
        arrival_probability(100)


def test_sample_charging_needs_km():
    """Test that sample_charging_needs_km returns valid distance values."""
    valid_km = [0, 5, 10, 20, 30, 50, 100, 200, 300]
    for _ in range(100):
        km = sample_charging_needs_km()
        assert km in valid_km


def test_sample_charging_energy():
    """Test that sample_charging_energy returns positive values."""
    for _ in range(10):
        energy = sample_charging_energy()
        assert energy >= 0
