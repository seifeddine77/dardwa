import {
  Medicine,
  Pharmacy,
  DutySchedule,
  AvailabilityReport,
  ModerationStatus,
  ReportStatus,
} from "@/types/domain.types";
import {
  SEED_MEDICINES,
  SEED_PHARMACIES,
  SEED_DUTY_SCHEDULES,
} from "./mock-dataset";
import { searchMedicinesInMemory } from "@/features/search/search-service";

interface DataStore {
  medicines: Medicine[];
  pharmacies: Pharmacy[];
  dutySchedules: DutySchedule[];
  reports: AvailabilityReport[];
}

// Global singleton ensuring data persists dynamically across all requests & API routes in Node.js
declare global {
  // eslint-disable-next-line no-var
  var __dardwa_store__: DataStore | undefined;
}

function getStore(): DataStore {
  if (!globalThis.__dardwa_store__) {
    globalThis.__dardwa_store__ = {
      medicines: [...SEED_MEDICINES],
      pharmacies: [...SEED_PHARMACIES],
      dutySchedules: [...SEED_DUTY_SCHEDULES],
      reports: [
        {
          id: "rep-1",
          medicineId: "d1000000-0000-0000-0000-000000000001",
          pharmacyId: "e1000000-0000-0000-0000-000000000001",
          status: "available",
          moderationStatus: "approved",
          createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 46 * 3600 * 1000).toISOString(),
        },
        {
          id: "rep-2",
          medicineId: "d1000000-0000-0000-0000-000000000001",
          pharmacyId: "e1000000-0000-0000-0000-000000000001",
          status: "available",
          moderationStatus: "approved",
          createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 45 * 3600 * 1000).toISOString(),
        },
        {
          id: "rep-3",
          medicineId: "d1000000-0000-0000-0000-000000000004",
          pharmacyId: "e1000000-0000-0000-0000-000000000002",
          status: "out_of_stock",
          moderationStatus: "approved",
          createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 47 * 3600 * 1000).toISOString(),
        },
      ],
    };
  }
  return globalThis.__dardwa_store__;
}

// ============================================================================
// DYNAMIC MEDICINES API
// ============================================================================

export async function getAllMedicines(filter?: {
  q?: string;
  genericOnly?: boolean;
  cnamOnly?: boolean;
}): Promise<Medicine[]> {
  const store = getStore();
  let list = store.medicines;

  if (filter?.q && filter.q.trim().length > 0) {
    const hits = searchMedicinesInMemory(filter.q.trim(), list, 100);
    list = hits.map((h) => h.medicine);
  }

  if (filter?.genericOnly) {
    list = list.filter((m) => m.isGeneric);
  }

  if (filter?.cnamOnly) {
    list = list.filter((m) => m.cnamCovered);
  }

  return list;
}

export async function getMedicineById(id: string): Promise<Medicine | null> {
  const store = getStore();
  return store.medicines.find((m) => m.id === id) || null;
}

export type InsertMedicineInput = Partial<Medicine> &
  Pick<
    Medicine,
    | "code"
    | "brandName"
    | "dosage"
    | "form"
    | "publicPriceTnd"
    | "isGeneric"
    | "cnamCovered"
  >;

export async function insertMedicines(
  newItems: InsertMedicineInput[]
): Promise<Medicine[]> {
  const store = getStore();
  const created: Medicine[] = [];

  for (const item of newItems) {
    const id = item.id || `med-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const existingIdx = store.medicines.findIndex(
      (m) => m.code.toLowerCase() === item.code.toLowerCase()
    );

    const fullItem: Medicine = {
      ...item,
      id: existingIdx >= 0 ? store.medicines[existingIdx].id : id,
      formCategory: item.formCategory || "tablet",
      lastUpdatedAt: item.lastUpdatedAt || new Date().toISOString().split("T")[0],
      isActive: item.isActive ?? true,
      ingredients: item.ingredients || [{ id: "dci-1", name: (item as any).dci || "DCI" }],
    };

    if (existingIdx >= 0) {
      store.medicines[existingIdx] = fullItem;
      created.push(fullItem);
    } else {
      store.medicines.unshift(fullItem);
      created.push(fullItem);
    }
  }

  return created;
}

// ============================================================================
// DYNAMIC PHARMACIES API
// ============================================================================

export async function getAllPharmacies(filter?: {
  governorate?: string;
}): Promise<Pharmacy[]> {
  const store = getStore();
  let list = store.pharmacies;

  if (filter?.governorate && filter.governorate !== "all") {
    list = list.filter(
      (p) => p.governorate.toLowerCase() === filter.governorate!.toLowerCase()
    );
  }

  return list;
}

export async function getPharmacyById(id: string): Promise<Pharmacy | null> {
  const store = getStore();
  return store.pharmacies.find((p) => p.id === id) || null;
}

export type InsertPharmacyInput = Partial<Pharmacy> &
  Pick<
    Pharmacy,
    | "name"
    | "governorate"
    | "delegation"
    | "address"
    | "phone"
    | "latitude"
    | "longitude"
  >;

export async function insertPharmacies(
  newItems: InsertPharmacyInput[]
): Promise<Pharmacy[]> {
  const store = getStore();
  const created: Pharmacy[] = [];

  for (const item of newItems) {
    const id = item.id || `pharm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const fullItem: Pharmacy = {
      ...item,
      id,
      isVerified: item.isVerified ?? true,
      isNightShiftCapable: item.isNightShiftCapable ?? false,
    };
    store.pharmacies.unshift(fullItem);
    created.push(fullItem);
  }

  return created;
}

// ============================================================================
// DYNAMIC DUTY SCHEDULES API
// ============================================================================

export async function getAllDutySchedules(filter?: {
  date?: string;
  governorate?: string;
}): Promise<DutySchedule[]> {
  const store = getStore();
  let list = store.dutySchedules;

  if (filter?.governorate && filter.governorate !== "all") {
    list = list.filter(
      (s) =>
        s.pharmacy?.governorate.toLowerCase() ===
        filter.governorate!.toLowerCase()
    );
  }

  return list;
}

export async function addDutySchedule(
  schedule: Omit<DutySchedule, "id">
): Promise<DutySchedule> {
  const store = getStore();
  const id = `duty-${Date.now()}`;
  const pharm = store.pharmacies.find((p) => p.id === schedule.pharmacyId);

  const fullSchedule: DutySchedule = {
    ...schedule,
    id,
    pharmacy: pharm || schedule.pharmacy,
  };

  store.dutySchedules.unshift(fullSchedule);
  return fullSchedule;
}

export async function removeDutySchedule(id: string): Promise<boolean> {
  const store = getStore();
  const initialLen = store.dutySchedules.length;
  store.dutySchedules = store.dutySchedules.filter((s) => s.id !== id);
  return store.dutySchedules.length < initialLen;
}

// ============================================================================
// DYNAMIC AVAILABILITY REPORTS & MODERATION API
// ============================================================================

export async function getActiveReports(filter?: {
  medicineId?: string;
  pharmacyId?: string;
  moderationStatus?: ModerationStatus;
}): Promise<AvailabilityReport[]> {
  const store = getStore();
  const now = Date.now();

  let list = store.reports.filter((r) => new Date(r.expiresAt).getTime() > now);

  if (filter?.medicineId) {
    list = list.filter((r) => r.medicineId === filter.medicineId);
  }

  if (filter?.pharmacyId) {
    list = list.filter((r) => r.pharmacyId === filter.pharmacyId);
  }

  if (filter?.moderationStatus) {
    list = list.filter((r) => r.moderationStatus === filter.moderationStatus);
  }

  return list;
}

export async function addReport(report: {
  medicineId: string;
  pharmacyId: string;
  status: ReportStatus;
  userId?: string;
}): Promise<AvailabilityReport> {
  const store = getStore();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 48 * 3600 * 1000);

  const newReport: AvailabilityReport = {
    id: `rep-${Date.now()}`,
    medicineId: report.medicineId,
    pharmacyId: report.pharmacyId,
    status: report.status,
    userId: report.userId,
    moderationStatus: "approved",
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  store.reports.unshift(newReport);
  return newReport;
}

export async function getAllReports(): Promise<AvailabilityReport[]> {
  const store = getStore();
  return [...store.reports];
}

export async function setReportModerationStatus(
  id: string,
  status: ModerationStatus
): Promise<boolean> {
  const store = getStore();
  const report = store.reports.find((r) => r.id === id);
  if (!report) return false;
  report.moderationStatus = status;
  return true;
}

export function resetStore(): void {
  globalThis.__dardwa_store__ = undefined;
}
