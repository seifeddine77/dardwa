/**
 * DarDwa (دار الدواء) - Core Domain Types
 */

export type UserRole = "user" | "verified_pharmacist" | "moderator" | "admin";
export type DutyType = "night" | "day" | "continuous_24h";
export type ReportStatus = "available" | "out_of_stock";
export type ModerationStatus = "pending" | "approved" | "rejected";

export type FormCategory =
  | "tablet"
  | "capsule"
  | "syrup"
  | "injection"
  | "cream"
  | "drops"
  | "inhaler"
  | "suppository"
  | "other";

export interface ActiveIngredient {
  id: string;
  name: string;
  nameAr?: string;
}

export interface Laboratory {
  id: string;
  name: string;
  country: string;
}

export interface Medicine {
  id: string;
  code: string;
  brandName: string;
  brandNameAr?: string;
  dosage: string;
  dosageMg?: number;
  form: string;
  formCategory: FormCategory;
  presentation?: string;
  laboratoryId?: string;
  laboratoryName?: string;
  publicPriceTnd: number; // In TND (e.g. 4.350)
  isGeneric: boolean; // false = princeps, true = generic
  cnamCovered: boolean;
  cnamReferenceTariff?: number;
  lastUpdatedAt: string;
  isActive: boolean;
  ingredients: ActiveIngredient[];
}

export interface GenericEquivalent {
  id: string;
  brandName: string;
  brandNameAr?: string;
  dosage: string;
  form: string;
  publicPriceTnd: number;
  priceDifferenceTnd: number;
  percentageSavings: number;
  isGeneric: boolean;
  cnamCovered: boolean;
  laboratoryName?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  nameAr?: string;
  governorate: string;
  delegation: string;
  address: string;
  postalCode?: string;
  phone?: string;
  phoneEmergency?: string;
  latitude: number;
  longitude: number;
  isNightShiftCapable: boolean;
  isVerified: boolean;
  openingHours?: Record<string, string>;
}

export interface DutySchedule {
  id: string;
  pharmacyId: string;
  pharmacy?: Pharmacy;
  dutyDate: string; // YYYY-MM-DD
  dutyType: DutyType;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface AvailabilityReport {
  id: string;
  medicineId: string;
  pharmacyId: string;
  status: ReportStatus;
  userId?: string;
  moderationStatus: ModerationStatus;
  createdAt: string;
  expiresAt: string;
}

export interface AggregateAvailability {
  medicineId: string;
  pharmacyId: string;
  availableCount: number;
  outOfStockCount: number;
  lastReportedAt: string;
  computedStatus: ReportStatus | "unknown";
}
