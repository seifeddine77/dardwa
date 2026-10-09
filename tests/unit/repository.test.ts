import { describe, it, expect, beforeEach } from "vitest";
import {
  getAllMedicines,
  getMedicineById,
  insertMedicines,
  getAllPharmacies,
  getPharmacyById,
  insertPharmacies,
  getAllDutySchedules,
  addDutySchedule,
  removeDutySchedule,
  getActiveReports,
  getAllReports,
  addReport,
  setReportModerationStatus,
  resetStore,
} from "@/lib/data/repository";

describe("Dynamic Repository & In-Memory Store", () => {
  beforeEach(() => {
    resetStore();
  });

  describe("Medicines Dynamic Operations", () => {
    it("retrieves the initial catalog of medicines", async () => {
      const medicines = await getAllMedicines();
      expect(medicines.length).toBeGreaterThan(0);
      expect(medicines.some((m) => m.brandName === "DOLIPRANE 1000")).toBe(true);
    });

    it("filters medicines dynamically by search query, generic, and cnam flags", async () => {
      const dolipraneResults = await getAllMedicines({ q: "doliprane" });
      expect(dolipraneResults.length).toBeGreaterThan(0);
      expect(dolipraneResults.every((m) => m.brandName.toLowerCase().includes("doliprane"))).toBe(true);

      const genericOnly = await getAllMedicines({ genericOnly: true });
      expect(genericOnly.every((m) => m.isGeneric)).toBe(true);

      const cnamOnly = await getAllMedicines({ cnamOnly: true });
      expect(cnamOnly.every((m) => m.cnamCovered)).toBe(true);
    });

    it("fetches single medicine by ID or returns null if not found", async () => {
      const all = await getAllMedicines();
      const first = all[0];

      const found = await getMedicineById(first.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(first.id);

      const missing = await getMedicineById("non-existent-id-999");
      expect(missing).toBeNull();
    });

    it("dynamically inserts new medicines and makes them instantly searchable", async () => {
      const newMedicine = {
        code: "PCT-TEST-999",
        brandName: "TESTOCILLINE 500",
        form: "Gélule",
        dosage: "500 mg",
        publicPriceTnd: 6.85,
        isGeneric: true,
        cnamCovered: true,
        ingredients: [{ id: "dci-test", name: "TESTOCILLINUM" }],
      };

      const inserted = await insertMedicines([newMedicine]);
      expect(inserted).toHaveLength(1);
      expect(inserted[0].brandName).toBe("TESTOCILLINE 500");

      // Verify immediate searchability
      const searchHits = await getAllMedicines({ q: "testocilline" });
      expect(searchHits.length).toBeGreaterThan(0);
      expect(searchHits[0].code).toBe("PCT-TEST-999");

      // Verify retrieval by ID
      const direct = await getMedicineById(inserted[0].id);
      expect(direct).not.toBeNull();
      expect(direct?.brandName).toBe("TESTOCILLINE 500");
    });
  });

  describe("Pharmacies Dynamic Operations", () => {
    it("retrieves pharmacies with governorate filtering", async () => {
      const all = await getAllPharmacies();
      expect(all.length).toBeGreaterThan(0);

      const tunisOnly = await getAllPharmacies({ governorate: "Tunis" });
      expect(tunisOnly.every((p) => p.governorate === "Tunis")).toBe(true);
    });

    it("dynamically inserts pharmacies and allows retrieval by ID", async () => {
      const newPharmacy = {
        name: "Pharmacie Nouvelle La Marsa",
        governorate: "Tunis",
        delegation: "La Marsa",
        address: "Avenue Habib Bourguiba, La Marsa",
        phone: "71740000",
        latitude: 36.878,
        longitude: 10.325,
      };

      const inserted = await insertPharmacies([newPharmacy]);
      expect(inserted).toHaveLength(1);
      expect(inserted[0].name).toBe("Pharmacie Nouvelle La Marsa");

      const retrieved = await getPharmacyById(inserted[0].id);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.delegation).toBe("La Marsa");
    });
  });

  describe("Duty Schedules Dynamic Operations", () => {
    it("retrieves duty schedules and filters by governorate", async () => {
      const all = await getAllDutySchedules();
      expect(all.length).toBeGreaterThan(0);

      const tunisOnly = await getAllDutySchedules({ governorate: "Tunis" });
      expect(tunisOnly.every((s) => s.pharmacy?.governorate.toLowerCase() === "tunis")).toBe(true);
    });

    it("adds and removes a duty schedule dynamically", async () => {
      const pharmacies = await getAllPharmacies();
      const targetPharm = pharmacies[0];

      const newDuty = await addDutySchedule({
        pharmacyId: targetPharm.id,
        dutyDate: "2026-12-31",
        dutyType: "night",
        startTime: "20:00",
        endTime: "08:00",
        notes: "Garde réveillon",
      });

      expect(newDuty.id).toBeDefined();
      expect(newDuty.pharmacy?.id).toBe(targetPharm.id);

      const afterAdd = await getAllDutySchedules();
      expect(afterAdd.some((s) => s.id === newDuty.id)).toBe(true);

      const removed = await removeDutySchedule(newDuty.id);
      expect(removed).toBe(true);

      const afterRemove = await getAllDutySchedules();
      expect(afterRemove.some((s) => s.id === newDuty.id)).toBe(false);
    });
  });

  describe("Availability Reports & Moderation Dynamic Operations", () => {
    it("records a report with 48h TTL and aggregates active reports", async () => {
      const medicines = await getAllMedicines();
      const pharmacies = await getAllPharmacies();

      const newReport = await addReport({
        medicineId: medicines[0].id,
        pharmacyId: pharmacies[0].id,
        status: "available",
      });

      expect(newReport.id).toBeDefined();
      expect(newReport.moderationStatus).toBe("approved");

      const active = await getActiveReports({ medicineId: medicines[0].id });
      expect(active.some((r) => r.id === newReport.id)).toBe(true);
    });

    it("updates moderation status dynamically", async () => {
      const allReports = await getAllReports();
      const first = allReports[0];

      const updated = await setReportModerationStatus(first.id, "rejected");
      expect(updated).toBe(true);

      const refreshed = await getAllReports();
      const updatedReport = refreshed.find((r) => r.id === first.id);
      expect(updatedReport?.moderationStatus).toBe("rejected");
    });
  });
});
