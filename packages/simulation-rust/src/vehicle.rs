/// Vehicle module for the simulation.

/// Represents a vehicle with charging needs.
pub struct Vehicle {
    left_to_charge: f64,
}

impl Vehicle {
    /// Create a new vehicle with a charging demand.
    ///
    /// # Arguments
    ///
    /// * `charging_demand` - Energy needed in kWh
    pub fn new(charging_demand: f64) -> Self {
        Self {
            left_to_charge: charging_demand,
        }
    }

    /// Charge the vehicle with specified energy.
    ///
    /// # Arguments
    ///
    /// * `energy_kwh` - Energy to charge in kWh
    ///
    /// # Returns
    ///
    /// Energy actually delivered in kWh
    ///
    /// # Panics
    ///
    /// Panics if the vehicle is not charging.
    pub fn charge(&mut self, energy_kwh: f64) -> f64 {
        if !self.is_charging() {
            panic!("Vehicle is not charging");
        }

        let energy_delivered = energy_kwh.min(self.left_to_charge);
        self.left_to_charge -= energy_delivered;
        energy_delivered
    }

    /// Check if the vehicle is still charging.
    ///
    /// # Returns
    ///
    /// True if the vehicle still needs charging, False otherwise
    pub fn is_charging(&self) -> bool {
        self.left_to_charge > 0.0
    }
}
