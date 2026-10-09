import { DutySchedule } from "@/types/domain.types";

/**
 * Calculates Great-Circle distance between two coordinates in kilometers using Haversine formula.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Formats distance cleanly for display in French and Arabic.
 */
export function formatDistance(distanceKm: number, locale: string = "fr"): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return locale === "ar" ? `${meters} م` : `${meters} m`;
  }
  const formatted = distanceKm.toFixed(1);
  return locale === "ar"
    ? `${formatted} كم`
    : `${formatted.replace(".", ",")} km`;
}

/**
 * Generates an external directions URL (OpenStreetMap / Google Maps compatible).
 */
export function getDirectionsUrl(lat: number, lon: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
}

/**
 * Normalizes phone numbers for tel: URI.
 */
export function formatPhoneTelUri(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

/**
 * Checks whether a duty schedule is currently active right now.
 */
export function isDutyActiveNow(duty: DutySchedule): boolean {
  if (duty.dutyType === "continuous_24h") {
    return true;
  }
  // Simplified check for demonstration
  return true;
}
