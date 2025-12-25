/// Probability distributions for EV arrival and charging needs.
use rand::{seq::SliceRandom, Rng};

/// Calculate arrival probability (within 1 hour interval) T1 for a given hour of the day.
///
/// # Arguments
///
/// * `hour` - Hour of the day (0-23)
///
/// # Returns
///
/// Probability of arrival (0.0 to 1.0)
pub fn arrival_probability(hour: u32) -> f64 {
    match hour {
        0..=7 => 0.0094,
        8..=9 => 0.0283,
        10..=12 => 0.0566,
        13..=15 => 0.0755,
        16..=18 => 0.1038,
        19..=21 => 0.0472,
        22..=23 => 0.0094,
        _ => panic!("Invalid hour: {}", hour),
    }
}

/// Sample charging needs based on vehicle consumption.
///
/// # Returns
///
/// Sampled distance in km
pub fn sample_charging_needs_km(rng: &mut impl Rng) -> u32 {
    let km: [(u32, f64); 9] = [
        (0, 0.3431),
        (5, 0.049),
        (10, 0.098),
        (20, 0.1176),
        (30, 0.0882),
        (50, 0.1176),
        (100, 0.1078),
        (200, 0.049),
        (300, 0.0294),
    ];

    km.choose_weighted(rng, |item| item.1).unwrap().0
}

/// Sample charging energy based on vehicle consumption.
///
/// # Arguments
///
/// * `consumption_kwh_per_100km` - Vehicle consumption in kWh per 100km (default: 18)
/// * `rng` - Random number generator
///
/// # Returns
///
/// Sampled energy in kWh
pub fn sample_charging_energy(consumption_kwh_per_100km: f64, rng: &mut impl Rng) -> f64 {
    let km = sample_charging_needs_km(rng);
    (km as f64 / 100.0) * consumption_kwh_per_100km
}

/// Sample whether an arrival occurs in a given hour.
///
/// Note: doesn't account for the intervals spanning multiple hours.
///
/// # Arguments
///
/// * `hour` - Hour of the day (0-23)
/// * `interval_minutes` - Length of the interval in minutes
/// * `arrival_multiplier` - Multiplier for the arrival probability
/// * `rng` - Random number generator
///
/// # Returns
///
/// True if arrival occurs, False otherwise
pub fn sample_arrival(
    hour: u32,
    interval_minutes: u32,
    arrival_multiplier: f64,
    rng: &mut impl Rng,
) -> bool {
    let probability = arrival_probability(hour);
    let adjusted_probability = probability * (interval_minutes as f64 / 60.0) * arrival_multiplier;
    rng.gen::<f64>() < adjusted_probability
}
