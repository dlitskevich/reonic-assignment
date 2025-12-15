import { ChargepointConfig, SimulationParameters } from "../types";

/**
 * Serializes simulation parameters to URL query parameters
 */
export function serializeParametersToUrl(
  params: SimulationParameters
): URLSearchParams {
  const searchParams = new URLSearchParams();

  // Serialize chargepoints as JSON
  searchParams.set("chargepoints", chargePointArrayToUrl(params.chargepoints));
  searchParams.set(
    "consumptionKwhPer100km",
    params.consumptionKwhPer100km.toString()
  );
  searchParams.set("days", params.days.toString());
  searchParams.set("intervalMinutes", params.intervalMinutes.toString());
  searchParams.set(
    "arrivalProbabilityMultiplier",
    params.arrivalProbabilityMultiplier.toString()
  );

  return searchParams;
}

/**
 * Deserializes simulation parameters from URL query parameters
 * Returns null if parameters are invalid or missing
 */
export function deserializeParametersFromUrl(): SimulationParameters | null {
  const searchParams = new URLSearchParams(window.location.search);

  try {
    const chargepointsStr = searchParams.get("chargepoints");
    if (!chargepointsStr) {
      return null;
    }

    const chargepoints = chargePointArrayFromUrl(chargepointsStr);

    const consumptionKwhPer100km = parseFloat(
      searchParams.get("consumptionKwhPer100km") || ""
    );
    const days = parseInt(searchParams.get("days") || "");
    const intervalMinutes = parseInt(searchParams.get("intervalMinutes") || "");
    const arrivalProbabilityMultiplier = parseFloat(
      searchParams.get("arrivalProbabilityMultiplier") || ""
    );

    // Validate all required parameters are present and valid
    if (
      isNaN(consumptionKwhPer100km) ||
      isNaN(days) ||
      isNaN(intervalMinutes) ||
      isNaN(arrivalProbabilityMultiplier) ||
      consumptionKwhPer100km <= 0 ||
      days <= 0 ||
      intervalMinutes <= 0 ||
      arrivalProbabilityMultiplier < 20 ||
      arrivalProbabilityMultiplier > 200
    ) {
      return null;
    }

    return {
      chargepoints,
      consumptionKwhPer100km,
      days,
      intervalMinutes,
      arrivalProbabilityMultiplier,
    };
  } catch (error) {
    console.error("Failed to parse URL parameters:", error);
    return null;
  }
}

/**
 * Updates URL with new parameters without page reload
 */
export function updateUrlParameters(params: SimulationParameters): void {
  const searchParams = serializeParametersToUrl(params);
  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
  window.history.replaceState({}, "", newUrl);
}

export function chargePointArrayToUrl(
  chargepoints: ChargepointConfig[]
): string {
  return chargepoints
    .map((cp) => `${cp.count}-${cp.powerKw.toFixed(1)}`)
    .join("_");
}

export function chargePointArrayFromUrl(
  chargepoints: string
): ChargepointConfig[] {
  return chargepoints.split("_").map((cp) => {
    const [count, powerKw] = cp.split("-");
    return { count: parseInt(count), powerKw: parseFloat(powerKw) };
  });
}
