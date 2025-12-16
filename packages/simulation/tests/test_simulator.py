"""Tests for the simulator."""

from src.simulator import Simulator


def test_simulator_initialization():
    """Test that simulator initializes correctly."""
    sim = Simulator(num_chargepoints=5, days=1)
    assert sim.num_chargepoints == 5
    assert len(sim.chargepoints) == 5
    assert sim.days == 1


def test_simulator_run():
    """Test that simulator runs and produces results."""
    sim = Simulator(num_chargepoints=2, days=1)
    results = sim.run()

    assert "total_energy_kwh" in results
    assert "max_power_kw" in results
    assert "concurrency_factor" in results
    assert "max_theoretical_power_kw" in results
    assert "power_history" in results
    assert results["total_energy_kwh"] >= 0
    assert results["max_power_kw"] >= 0
    assert 0 <= results["concurrency_factor"] <= 1


def test_simulator_with_custom_parameters():
    """Test simulator with custom parameters."""
    sim = Simulator(
        num_chargepoints=10,
        power_per_chargepoint_kw=22.0,
        consumption_kwh_per_100km=20.0,
        days=7,
    )
    results = sim.run()

    assert results["total_energy_kwh"] >= 0
    assert results["max_power_kw"] <= 220.0  # 10 * 22kW
    assert results["max_theoretical_power_kw"] == 220.0


def test_simulator_power_history():
    """Test that power history is recorded."""
    sim = Simulator(num_chargepoints=3, days=1)
    results = sim.run()

    assert "power_history" in results
    assert len(results["power_history"]) > 0
    intervals_per_day = (24 * 60) // 15  # 96 intervals per day
    # Simulator adds one extra interval (total_intervals + 1)
    assert len(results["power_history"]) == intervals_per_day + 1
