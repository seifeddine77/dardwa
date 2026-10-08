import { describe, it, expect } from "vitest";
import {
  normalizeSearchString,
  calculateTrigramSimilarity,
  searchMedicinesInMemory,
} from "@/features/search/search-service";
import { SEED_MEDICINES } from "@/lib/data/mock-dataset";

describe("Search String Normalization", () => {
  it("removes French accents correctly", () => {
    expect(normalizeSearchString("Paracétamol")).toBe("paracetamol");
    expect(normalizeSearchString("Gélule Gastro-résistante")).toBe("gelule gastro-resistante");
  });

  it("normalizes Arabic characters and strips diacritics (Tashkeel)", () => {
    // With Tashkeel: دُولِيبْرَانْ -> دوليبران
    expect(normalizeSearchString("دُولِيبْرَانْ")).toBe("دوليبران");
    // Alef variants
    expect(normalizeSearchString("أموكسيسيلين")).toBe("اموكسيسيلين");
    expect(normalizeSearchString("إيبوبروفين")).toBe("ايبوبروفين");
  });
});

describe("Trigram Similarity", () => {
  it("computes 1.0 for identical strings", () => {
    const sim = calculateTrigramSimilarity("doliprane", "doliprane");
    expect(sim).toBe(1.0);
  });

  it("computes high similarity for minor typo (e.g. dolipran vs doliprane)", () => {
    const sim = calculateTrigramSimilarity("dolipran", "doliprane");
    expect(sim).toBeGreaterThan(0.7);
  });

  it("computes low or zero similarity for unrelated words", () => {
    const sim = calculateTrigramSimilarity("paracetamol", "ibuprofene");
    expect(sim).toBeLessThan(0.2);
  });
});

describe("Medicine Search Engine", () => {
  it("finds medicine by brand name prefix or exact name", () => {
    const results = searchMedicinesInMemory("doliprane", SEED_MEDICINES);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].medicine.brandName).toContain("DOLIPRANE");
    expect(results[0].score).toBeGreaterThanOrEqual(0.85);

    const exactResults = searchMedicinesInMemory("DOLIPRANE 1000", SEED_MEDICINES);
    expect(exactResults[0].score).toBe(1.0);
  });

  it("finds medicine with typo in brand name", () => {
    const results = searchMedicinesInMemory("dolipran", SEED_MEDICINES);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].medicine.brandName).toContain("DOLIPRANE");
  });

  it("finds all medicines containing a specific active ingredient (DCI)", () => {
    const results = searchMedicinesInMemory("amoxicilline", SEED_MEDICINES);
    expect(results.length).toBe(3); // Clamoxyl, Amoxil, Amoxipen
    const brandNames = results.map((r) => r.medicine.brandName);
    expect(brandNames).toContain("CLAMOXYL 1g");
    expect(brandNames).toContain("AMOXIL 1g");
    expect(brandNames).toContain("AMOXIPEN 1g");
  });

  it("finds medicine with Arabic query", () => {
    const results = searchMedicinesInMemory("دوليبران", SEED_MEDICINES);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].medicine.brandName).toContain("DOLIPRANE");
  });

  it("finds medicines by Arabic active ingredient (DCI)", () => {
    const results = searchMedicinesInMemory("باراسيتامول", SEED_MEDICINES);
    expect(results.length).toBeGreaterThanOrEqual(3);
  });

  it("returns empty array for empty query or whitespace", () => {
    expect(searchMedicinesInMemory("", SEED_MEDICINES)).toEqual([]);
    expect(searchMedicinesInMemory("   ", SEED_MEDICINES)).toEqual([]);
  });
});
