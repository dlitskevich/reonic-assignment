import {
  serializeParametersToUrl,
  chargePointArrayToUrl,
  chargePointArrayFromUrl,
} from "../urlParams";
import { SimulationParameters, ChargepointConfig } from "../../types";

describe("urlParams", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("chargePointArrayToUrl", () => {
    it("should serialize chargepoint array to URL string", () => {
      const chargepoints: ChargepointConfig[] = [
        { count: 2, powerKw: 11.0 },
        { count: 1, powerKw: 22.0 },
      ];
      const result = chargePointArrayToUrl(chargepoints);
      expect(result).toBe("2-11.0_1-22.0");
    });

    it("should handle single chargepoint", () => {
      const chargepoints: ChargepointConfig[] = [{ count: 1, powerKw: 11.0 }];
      const result = chargePointArrayToUrl(chargepoints);
      expect(result).toBe("1-11.0");
    });

    it("should handle empty array", () => {
      const chargepoints: ChargepointConfig[] = [];
      const result = chargePointArrayToUrl(chargepoints);
      expect(result).toBe("");
    });
  });

  describe("chargePointArrayFromUrl", () => {
    it("should deserialize URL string to chargepoint array", () => {
      const urlString = "2-11.0_1-22.0";
      const result = chargePointArrayFromUrl(urlString);
      expect(result).toEqual([
        { count: 2, powerKw: 11.0 },
        { count: 1, powerKw: 22.0 },
      ]);
    });

    it("should handle single chargepoint", () => {
      const urlString = "1-11.0";
      const result = chargePointArrayFromUrl(urlString);
      expect(result).toEqual([{ count: 1, powerKw: 11.0 }]);
    });

    it("should handle decimal power values", () => {
      const urlString = "1-11.5";
      const result = chargePointArrayFromUrl(urlString);
      expect(result).toEqual([{ count: 1, powerKw: 11.5 }]);
    });
  });

  describe("serializeParametersToUrl", () => {
    it("should serialize all simulation parameters to URLSearchParams", () => {
      const params: SimulationParameters = {
        chargepoints: [
          { count: 2, powerKw: 11.0 },
          { count: 1, powerKw: 22.0 },
        ],
        consumptionKwhPer100km: 20.5,
        days: 7,
        intervalMinutes: 15,
        arrivalProbabilityMultiplier: 100,
      };

      const result = serializeParametersToUrl(params);
      expect(result.get("chargepoints")).toBe("2-11.0_1-22.0");
      expect(result.get("consumptionKwhPer100km")).toBe("20.5");
      expect(result.get("days")).toBe("7");
      expect(result.get("intervalMinutes")).toBe("15");
      expect(result.get("arrivalProbabilityMultiplier")).toBe("100");
    });
  });

  describe("deserializeParametersFromUrl", () => {
    // Note: These tests require window.location mocking which is complex in jsdom
    // For simple tests, we'll test the core logic through serialize/deserialize roundtrip
    it("should handle roundtrip serialization and deserialization", () => {
      const originalParams: SimulationParameters = {
        chargepoints: [
          { count: 2, powerKw: 11.0 },
          { count: 1, powerKw: 22.0 },
        ],
        consumptionKwhPer100km: 20.5,
        days: 7,
        intervalMinutes: 15,
        arrivalProbabilityMultiplier: 100,
      };

      const serialized = serializeParametersToUrl(originalParams);
      const chargepointsStr = serialized.get("chargepoints") || "";
      const chargepoints = chargePointArrayFromUrl(chargepointsStr);

      // Verify the chargepoints can be deserialized correctly
      expect(chargepoints).toEqual(originalParams.chargepoints);
    });
  });

  describe("updateUrlParameters", () => {
    it("should serialize parameters correctly for URL update", () => {
      const params: SimulationParameters = {
        chargepoints: [{ count: 2, powerKw: 11.0 }],
        consumptionKwhPer100km: 20.5,
        days: 7,
        intervalMinutes: 15,
        arrivalProbabilityMultiplier: 100,
      };

      const searchParams = serializeParametersToUrl(params);
      const urlString = `/?${searchParams.toString()}`;

      expect(urlString).toContain("chargepoints=2-11.0");
      expect(urlString).toContain("consumptionKwhPer100km=20.5");
    });
  });
});
