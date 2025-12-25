/// Chargepoint model for EV charging simulation.
use crate::vehicle::Vehicle;

/// Represents a single EV charging point with configurable power capacity.
pub struct Chargepoint {
    pub power_kw: f64,
    pub vehicle: Option<Vehicle>,
}

impl Chargepoint {
    /// Initialize a chargepoint.
    ///
    /// # Arguments
    ///
    /// * `power_kw` - Maximum charging power in kW (default: 11.0)
    pub fn new(power_kw: f64) -> Self {
        Self {
            power_kw,
            vehicle: None,
        }
    }

    /// Check if the chargepoint is charging a vehicle.
    ///
    /// # Returns
    ///
    /// True if the chargepoint is charging a vehicle, False otherwise
    pub fn is_charging(&self) -> bool {
        self.vehicle
            .as_ref()
            .map(|v| v.is_charging())
            .unwrap_or(false)
    }
}
