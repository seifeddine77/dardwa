import { describe, it, expect, beforeEach } from "vitest";
import {
  hashIpAddress,
  checkRateLimit,
  resetRateLimitStore,
} from "@/lib/rate-limit";
import {
  isReportExpired,
  aggregateReports,
  createReportSchema,
} from "@/features/reports/reports-service";
import { AvailabilityReport } from "@/types/domain.types";

describe("Cryptographic IP Hashing & Privacy (Law 2004-63)", () => {
  it("generates deterministic SHA-256 hashes without exposing raw IP", () => {
    const rawIp = "197.1.2.3";
    const hashA = hashIpAddress(rawIp, "daily-salt-1");
    const hashB = hashIpAddress(rawIp, "daily-salt-1");

    expect(hashA).toBe(hashB);
    expect(hashA).toHaveLength(64); // SHA-256 hex string
    expect(hashA).not.toContain(rawIp);
  });

  it("produces different hashes with different salts (daily rotation)", () => {
    const rawIp = "197.1.2.3";
    const hash1 = hashIpAddress(rawIp, "salt-day-1");
    const hash2 = hashIpAddress(rawIp, "salt-day-2");

    expect(hash1).not.toBe(hash2);
  });
});

describe("Rate Limiting Engine", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it("permits up to 5 requests within the rate limit window", () => {
    const key = "user-test-hash";

    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(key, 5, 60000);
      expect(result.success).toBe(true);
    }

    // 6th request must be blocked
    const blocked = checkRateLimit(key, 5, 60000);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });
});

describe("Report 48h TTL & Expiration", () => {
  it("correctly identifies unexpired reports within 48 hours", () => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 60 * 1000); // in 10h
    expect(isReportExpired(expiresAt, now)).toBe(false);
  });

  it("identifies expired reports after 48 hours", () => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() - 1000); // 1 sec in past
    expect(isReportExpired(expiresAt, now)).toBe(true);
  });
});

describe("Crowdsourced Availability Aggregator", () => {
  it("aggregates active unexpired reports and computes majority status", () => {
    const now = new Date();
    const mockReports: AvailabilityReport[] = [
      {
        id: "1",
        medicineId: "med-1",
        pharmacyId: "pharm-1",
        status: "available",
        moderationStatus: "approved",
        createdAt: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
        expiresAt: new Date(now.getTime() + 46 * 3600 * 1000).toISOString(),
      },
      {
        id: "2",
        medicineId: "med-1",
        pharmacyId: "pharm-1",
        status: "available",
        moderationStatus: "approved",
        createdAt: new Date(now.getTime() - 1 * 3600 * 1000).toISOString(),
        expiresAt: new Date(now.getTime() + 47 * 3600 * 1000).toISOString(),
      },
      {
        id: "3",
        medicineId: "med-1",
        pharmacyId: "pharm-1",
        status: "out_of_stock",
        moderationStatus: "approved",
        createdAt: new Date(now.getTime() - 3 * 3600 * 1000).toISOString(),
        expiresAt: new Date(now.getTime() + 45 * 3600 * 1000).toISOString(),
      },
    ];

    const result = aggregateReports(mockReports, "med-1", "pharm-1", now);
    expect(result.totalCount).toBe(3);
    expect(result.availableCount).toBe(2);
    expect(result.outOfStockCount).toBe(1);
    expect(result.computedStatus).toBe("available");
    expect(result.latestReportHoursAgo).toBe(1);
  });

  it("ignores expired reports in the summary", () => {
    const now = new Date();
    const mockReports: AvailabilityReport[] = [
      {
        id: "expired",
        medicineId: "med-1",
        pharmacyId: "pharm-1",
        status: "available",
        moderationStatus: "approved",
        createdAt: new Date(now.getTime() - 50 * 3600 * 1000).toISOString(),
        expiresAt: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(), // expired
      },
    ];

    const result = aggregateReports(mockReports, "med-1", "pharm-1", now);
    expect(result.totalCount).toBe(0);
    expect(result.computedStatus).toBe("unknown");
  });
});

describe("Honeypot & Report Schema Validation", () => {
  it("validates legitimate submissions", () => {
    const payload = {
      medicineId: "d1000000-0000-0000-0000-000000000001",
      pharmacyId: "e1000000-0000-0000-0000-000000000001",
      status: "available",
      website: "", // Honeypot clean
    };

    const parsed = createReportSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid UUIDs", () => {
    const payload = {
      medicineId: "not-a-uuid",
      pharmacyId: "invalid",
      status: "available",
    };

    const parsed = createReportSchema.safeParse(payload);
    expect(parsed.success).toBe(false);
  });
});
