/// Main entry point for running the EV charging station simulation.
mod chargepoint;
mod distributions;
mod simulator;
mod vehicle;

use std::collections::HashMap;
use std::time::Instant;

use clap::Parser;
use simulator::{SimulationResults, Simulator};

/// EV Charging Station Simulation
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Number of chargepoints
    #[arg(long, default_value_t = 20)]
    chargepoints: usize,

    /// Power per chargepoint in kW
    #[arg(long, default_value_t = 11.0)]
    power: f64,

    /// Vehicle consumption in kWh per 100km
    #[arg(long, default_value_t = 18.0)]
    consumption: f64,

    /// Number of days to simulate
    #[arg(long, default_value_t = 365)]
    days: u32,

    /// Multiplier for the arrival probability
    #[arg(long, default_value_t = 1.0)]
    arrival_multiplier: f64,

    /// Interval minutes
    #[arg(long, default_value_t = 15)]
    interval_minutes: u32,
}

fn main() {
    let args = Args::parse();

    // Run simulation
    println!(
        "Starting simulation with {} chargepoints...",
        args.chargepoints
    );
    println!("  Power: {} kW per chargepoint", args.power);
    println!("  Consumption: {} kWh/100km", args.consumption);
    println!("  Duration: {} days", args.days);
    println!("  Arrival multiplier: {}", args.arrival_multiplier);
    println!("  Interval minutes: {}", args.interval_minutes);
    println!();

    let mut simulator = Simulator::new(
        args.chargepoints,
        args.power,
        args.consumption,
        args.days,
        args.interval_minutes,
        args.arrival_multiplier,
    );

    let results = simulator.run();

    print_results(&results);
    average_simulation(&args);
}

fn print_results(results: &SimulationResults) {
    println!("Summary:");
    println!(
        "  Total energy delivered: {:.0} kWh",
        results.total_energy_kwh
    );
    println!("  Maximum power draw: {:.0} kW", results.max_power_kw);
    println!(
        "  Max theoretical power: {:.0} kW",
        results.max_theoretical_power_kw
    );
    println!("  Concurrency factor: {:.2}", results.concurrency_factor);
}

fn average_simulation(args: &Args) {
    let time_start = Instant::now();
    // Use u32 key (concurrency_factor * 100 rounded) since f64 can't be used as HashMap key
    let mut hash_counter: HashMap<u32, u32> = HashMap::new();
    for _ in 0..100 {
        let mut simulator = Simulator::new(
            args.chargepoints,
            args.power,
            args.consumption,
            args.days,
            args.interval_minutes,
            args.arrival_multiplier,
        );
        let results = simulator.run();
        // Round to 2 decimal places: multiply by 100, round, convert to u32
        let key = (results.concurrency_factor * 100.0).round() as u32;
        let count = hash_counter.entry(key).or_insert(0);
        *count += 1;
    }
    let mut sorted_keys: Vec<u32> = hash_counter.keys().copied().collect();
    sorted_keys.sort();
    for key in sorted_keys {
        let concurrency_factor = key as f64 / 100.0;
        let count = hash_counter[&key];
        println!(
            "Concurrency factor: {:.2}, Count: {}",
            concurrency_factor, count
        );
    }
    let time_end = Instant::now();
    println!("Time taken: {:?}", time_end.duration_since(time_start));
}
