/// Main simulation engine for EV charging stations.
use std::f64;

use crate::chargepoint::Chargepoint;
use crate::distributions::{sample_arrival, sample_charging_energy};
use crate::vehicle::Vehicle;

/// Main simulation engine that runs multiple chargepoints for a specified duration.
pub struct Simulator {
    num_chargepoints: usize,
    power_per_chargepoint_kw: f64,
    consumption_kwh_per_100km: f64,
    days: u32,
    interval_minutes: u32,
    arrival_multiplier: f64,
    chargepoints: Vec<Chargepoint>,
    power_history: Vec<f64>,
    total_energy: f64,
    rng: rand::rngs::ThreadRng,
}

impl Simulator {
    /// Initialize the simulator.
    ///
    /// # Arguments
    ///
    /// * `num_chargepoints` - Number of chargepoints to simulate
    /// * `power_per_chargepoint_kw` - Power capacity per chargepoint in kW
    /// * `consumption_kwh_per_100km` - Vehicle consumption in kWh per 100km
    /// * `days` - Number of days to simulate
    /// * `interval_minutes` - Duration of each time interval in minutes
    /// * `arrival_multiplier` - Multiplier for the arrival probability
    ///
    /// # Panics
    ///
    /// Panics if `interval_minutes` is greater than 60.
    pub fn new(
        num_chargepoints: usize,
        power_per_chargepoint_kw: f64,
        consumption_kwh_per_100km: f64,
        days: u32,
        interval_minutes: u32,
        arrival_multiplier: f64,
    ) -> Self {
        if interval_minutes > 60 {
            panic!("Interval minutes must be less than or equal to 60");
        }

        let chargepoints: Vec<Chargepoint> = (0..num_chargepoints)
            .map(|_| Chargepoint::new(power_per_chargepoint_kw))
            .collect();

        Self {
            num_chargepoints,
            power_per_chargepoint_kw,
            consumption_kwh_per_100km,
            days,
            interval_minutes,
            arrival_multiplier,
            chargepoints,
            power_history: Vec::new(),
            total_energy: 0.0,
            rng: rand::thread_rng(),
        }
    }

    /// Run the simulation.
    ///
    /// # Returns
    ///
    /// Simulation results containing total energy, max power, and power history
    pub fn run(&mut self) -> SimulationResults {
        let total_intervals =
            ((self.days * 24 * 60) as f64 / self.interval_minutes as f64).ceil() as u32;

        // At 0th interval, we do not have any arrivals
        for interval_idx in 1..=total_intervals {
            // Determine hour of day for arrival probability
            let hour = ((interval_idx * self.interval_minutes) / 60) % 24;

            // Perform charging step for all chargepoints
            let interval_energy = self.charge_step();
            self.arrival_step(hour);

            let mut power_demand = 0.0;
            for chargepoint in &self.chargepoints {
                if chargepoint.is_charging() {
                    power_demand += chargepoint.power_kw;
                }
            }

            self.total_energy += interval_energy;
            self.power_history.push(power_demand);
        }

        let max_power = self.power_history.iter().copied().fold(0.0, f64::max);
        let max_theoretical_power = self.num_chargepoints as f64 * self.power_per_chargepoint_kw;

        SimulationResults {
            total_energy_kwh: self.total_energy,
            max_power_kw: max_power,
            max_theoretical_power_kw: max_theoretical_power,
            concurrency_factor: max_power / max_theoretical_power,
            power_history: self.power_history.clone(),
        }
    }

    /// Perform one charging step for all chargepoints.
    ///
    /// # Returns
    ///
    /// Energy delivered in kWh for all chargepoints in the interval
    fn charge_step(&mut self) -> f64 {
        let mut energy_delivered = 0.0;
        let interval_hours = self.interval_minutes as f64 / 60.0;

        for chargepoint in &mut self.chargepoints {
            if let Some(ref mut vehicle) = chargepoint.vehicle {
                let energy_available = chargepoint.power_kw * interval_hours;
                energy_delivered += vehicle.charge(energy_available);

                if !vehicle.is_charging() {
                    chargepoint.vehicle = None;
                }
            }
        }

        energy_delivered
    }

    /// Perform one arrival step for each chargepoint.
    ///
    /// # Arguments
    ///
    /// * `hour` - Current hour of the day (0-23)
    fn arrival_step(&mut self, hour: u32) {
        for chargepoint in &mut self.chargepoints {
            if chargepoint.vehicle.is_some() {
                continue;
            }

            if !sample_arrival(
                hour,
                self.interval_minutes,
                self.arrival_multiplier,
                &mut self.rng,
            ) {
                continue;
            }

            let energy_needed =
                sample_charging_energy(self.consumption_kwh_per_100km, &mut self.rng);
            if energy_needed <= 0.0 {
                continue;
            }

            chargepoint.vehicle = Some(Vehicle::new(energy_needed));
        }
    }
}

/// Results from running a simulation.
#[derive(Debug, Clone)]
pub struct SimulationResults {
    pub total_energy_kwh: f64,
    pub max_power_kw: f64,
    pub max_theoretical_power_kw: f64,
    pub concurrency_factor: f64,
    pub power_history: Vec<f64>,
}
