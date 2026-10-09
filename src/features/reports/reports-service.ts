import { z } from "zod";
import { ReportStatus, ModerationStatus, AvailabilityReport } from "@/types/domain.types";

export const createReportSchema = z.object({
  medicineId: z.string().uuid("Identifiant médicament invalide"),
  pharmacyId: z.string().uuid("Identifiant pharmacie invalide"),
  status: z.enum(["available", "out_of_stock"]),
  email: z.string().email("Adresse email invalide").optional(),
  // Honeypot field: must remain empty, bots will fill it
  website: z.string().max(0, "Honeypot trigger").optional().default(""),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;

const REPORT_TTL_MS = 48 * 60 * 60 * 1000; // 48 hours

// Mock in-memory reports store
const mockReports: AvailabilityReport[] = [
  {
    id: "rep-1",
    medicineId: "d1000000-0000-0000-0000-000000000001",
    pharmacyId: "e1000000-0000-0000-0000-000000000001",
    status: "available",
    moderationStatus: "approved",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    expiresAt: new Date(Date.now() + 46 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "rep-2",
    medicineId: "d1000000-0000-0000-0000-000000000001",
    pharmacyId: "e1000000-0000-0000-0000-000000000001",
    status: "available",
    moderationStatus: "approved",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
    expiresAt: new Date(Date.now() + 44 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "rep-3",
    medicineId: "d1000000-0000-0000-0000-000000000004",
    pharmacyId: "e1000000-0000-0000-0000-000000000002",
    status: "out_of_stock",
    moderationStatus: "approved",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1h ago
    expiresAt: new Date(Date.now() + 47 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Checks if a report has exceeded the 48-hour regulatory TTL.
 */
export function isReportExpired(expiresAt: string | Date, now: Date = new Date()): boolean {
  const expiry = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  return now.getTime() >= expiry.getTime();
}

/**
 * Aggregates crowdsourced reports for a given medicine and pharmacy.
 */
export function aggregateReports(
  reports: AvailabilityReport[],
  medicineId: string,
  pharmacyId: string,
  now: Date = new Date()
) {
  const activeReports = reports.filter(
    (r) =>
      r.medicineId === medicineId &&
      r.pharmacyId === pharmacyId &&
      r.moderationStatus === "approved" &&
      !isReportExpired(r.expiresAt, now)
  );

  if (activeReports.length === 0) {
    return {
      totalCount: 0,
      availableCount: 0,
      outOfStockCount: 0,
      computedStatus: "unknown" as const,
      latestReportHoursAgo: null,
    };
  }

  const availableCount = activeReports.filter((r) => r.status === "available").length;
  const outOfStockCount = activeReports.filter((r) => r.status === "out_of_stock").length;

  // Find latest report
  const sorted = [...activeReports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const latestReport = sorted[0];
  const hoursAgo = Math.max(
    0,
    Math.round((now.getTime() - new Date(latestReport.createdAt).getTime()) / (1000 * 60 * 60))
  );

  return {
    totalCount: activeReports.length,
    availableCount,
    outOfStockCount,
    computedStatus: (availableCount >= outOfStockCount ? "available" : "out_of_stock") as ReportStatus,
    latestReportHoursAgo: hoursAgo,
  };
}

/**
 * Adds a new report to the store with a 48h expiration window.
 */
export function createReport(
  input: Omit<CreateReportInput, "website">,
  now: Date = new Date()
): AvailabilityReport {
  const createdAt = now.toISOString();
  const expiresAt = new Date(now.getTime() + REPORT_TTL_MS).toISOString();

  const newReport: AvailabilityReport = {
    id: `rep-${Date.now()}`,
    medicineId: input.medicineId,
    pharmacyId: input.pharmacyId,
    status: input.status,
    moderationStatus: "approved",
    createdAt,
    expiresAt,
  };

  mockReports.push(newReport);
  return newReport;
}

export function getAllReports(): AvailabilityReport[] {
  return mockReports;
}
