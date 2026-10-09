import { describe, it, expect } from "vitest";
import {
  calculateHaversineDistanceKm,
  formatDistance,
  formatPhoneTelUri,
  getDirectionsUrl,
} from "@/features/pharmacies/geo-utils";
import { TUNISIAN_GOVERNORATES } from "@/features/pharmacies/tunisian-territory";

describe("Pharmacy Geolocation Utilities", () => {
  it("calculates accurate Haversine distance between coordinates", () => {
    // Tunis Center (36.8002, 10.1815) to Ennasr (36.8571, 10.1582)
    const distance = calculateHaversineDistanceKm(
      36.8002,
      10.1815,
      36.8571,
      10.1582
    );
    expect(distance).toBeGreaterThan(6.0);
    expect(distance).toBeLessThan(7.5);

    // Distance to self is 0
    expect(calculateHaversineDistanceKm(36.8, 10.1, 36.8, 10.1)).toBe(0);
  });

  it("formats distances properly in French and Arabic", () => {
    // Under 1 km should format in meters
    expect(formatDistance(0.45, "fr")).toBe("450 m");
    expect(formatDistance(0.45, "ar")).toBe("450 م");

    // Over 1 km should format in kilometers
    expect(formatDistance(4.25, "fr")).toBe("4,3 km");
    expect(formatDistance(4.25, "ar")).toBe("4.3 كم");
  });

  it("formats phone numbers into valid tel: URI", () => {
    expect(formatPhoneTelUri("+216 71 245 100")).toBe("tel:+21671245100");
  });

  it("generates directions URL", () => {
    const url = getDirectionsUrl(36.8002, 10.1815);
    expect(url).toContain("destination=36.8002,10.1815");
  });
});

describe("Tunisian Territory", () => {
  it("defines the 24 official governorates with coordinates and Arabic names", () => {
    expect(TUNISIAN_GOVERNORATES).toHaveLength(24);

    const tunis = TUNISIAN_GOVERNORATES.find((g) => g.code === "tunis");
    expect(tunis).toBeDefined();
    expect(tunis?.nameAr).toBe("تونس");
    expect(tunis?.center).toHaveLength(2);

    const sfax = TUNISIAN_GOVERNORATES.find((g) => g.code === "sfax");
    expect(sfax?.nameAr).toBe("صفاقس");
  });
});
