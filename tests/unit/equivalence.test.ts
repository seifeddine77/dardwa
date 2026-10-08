import { describe, it, expect } from "vitest";
import {
  areMedicinesEquivalent,
  calculateSavings,
  findCheaperEquivalents,
  formatTndPrice,
} from "@/features/medicines/equivalence";
import { Medicine } from "@/types/domain.types";

const mockDoliprane1000: Medicine = {
  id: "med-1",
  code: "TN-001",
  brandName: "DOLIPRANE",
  brandNameAr: "دوليبران",
  dosage: "1000 mg",
  dosageMg: 1000,
  form: "Comprimé",
  formCategory: "tablet",
  publicPriceTnd: 4.85,
  isGeneric: false, // Princeps
  cnamCovered: true,
  lastUpdatedAt: "2026-01-01",
  isActive: true,
  ingredients: [{ id: "ing-1", name: "PARACETAMOL", nameAr: "باراسيتامول" }],
};

const mockParalyoc1000: Medicine = {
  id: "med-2",
  code: "TN-002",
  brandName: "PARALYOC",
  brandNameAr: "باراليوك",
  dosage: "1000 mg",
  dosageMg: 1000,
  form: "Comprimé",
  formCategory: "tablet",
  publicPriceTnd: 3.1,
  isGeneric: true, // Generic
  cnamCovered: true,
  lastUpdatedAt: "2026-01-01",
  isActive: true,
  ingredients: [{ id: "ing-1", name: "PARACETAMOL", nameAr: "باراسيتامول" }],
};

const mockAlgodol1000: Medicine = {
  id: "med-3",
  code: "TN-003",
  brandName: "ALGODOL",
  brandNameAr: "الغولودول",
  dosage: "1000 mg",
  dosageMg: 1000,
  form: "Comprimé",
  formCategory: "tablet",
  publicPriceTnd: 2.75,
  isGeneric: true,
  cnamCovered: true,
  lastUpdatedAt: "2026-01-01",
  isActive: true,
  ingredients: [{ id: "ing-1", name: "PARACETAMOL", nameAr: "باراسيتامول" }],
};

const mockDoliprane500: Medicine = {
  id: "med-4",
  code: "TN-004",
  brandName: "DOLIPRANE 500",
  dosage: "500 mg",
  dosageMg: 500,
  form: "Comprimé",
  formCategory: "tablet",
  publicPriceTnd: 2.5,
  isGeneric: false,
  cnamCovered: true,
  lastUpdatedAt: "2026-01-01",
  isActive: true,
  ingredients: [{ id: "ing-1", name: "PARACETAMOL" }],
};

const mockDolipraneSyrup: Medicine = {
  id: "med-5",
  code: "TN-005",
  brandName: "DOLIPRANE SIROP",
  dosage: "2.4%",
  dosageMg: 24,
  form: "Sirop",
  formCategory: "syrup",
  publicPriceTnd: 3.8,
  isGeneric: false,
  cnamCovered: true,
  lastUpdatedAt: "2026-01-01",
  isActive: true,
  ingredients: [{ id: "ing-1", name: "PARACETAMOL" }],
};

describe("Medicine Equivalence Logic", () => {
  it("recognizes therapeutic equivalence when DCI, dosage, and form match", () => {
    const isEquivalent = areMedicinesEquivalent(
      mockDoliprane1000,
      mockParalyoc1000
    );
    expect(isEquivalent).toBe(true);
  });

  it("rejects equivalence when dosages differ", () => {
    const isEquivalent = areMedicinesEquivalent(
      mockDoliprane1000,
      mockDoliprane500
    );
    expect(isEquivalent).toBe(false);
  });

  it("rejects equivalence when form categories differ", () => {
    const isEquivalent = areMedicinesEquivalent(
      mockDoliprane1000,
      mockDolipraneSyrup
    );
    expect(isEquivalent).toBe(false);
  });

  it("rejects equivalence against itself", () => {
    expect(
      areMedicinesEquivalent(mockDoliprane1000, mockDoliprane1000)
    ).toBe(false);
  });
});

describe("Savings Calculation", () => {
  it("calculates exact price difference and percentage savings in TND", () => {
    const savings = calculateSavings(4.85, 3.1);
    expect(savings.priceDifferenceTnd).toBe(1.75);
    expect(savings.percentageSavings).toBe(36.1);
  });

  it("returns zero savings if alternative is equal or more expensive", () => {
    const savings = calculateSavings(3.0, 3.5);
    expect(savings.priceDifferenceTnd).toBe(0);
    expect(savings.percentageSavings).toBe(0);
  });
});

describe("Cheaper Equivalents Finder", () => {
  it("finds, calculates savings, and sorts equivalents by price ascending", () => {
    const catalog = [
      mockDoliprane1000,
      mockParalyoc1000,
      mockAlgodol1000,
      mockDoliprane500,
    ];

    const results = findCheaperEquivalents(mockDoliprane1000, catalog);

    expect(results).toHaveLength(2);
    // Algodol (2.750) is cheaper than Paralyoc (3.100), so it should come first
    expect(results[0].brandName).toBe("ALGODOL");
    expect(results[0].publicPriceTnd).toBe(2.75);
    expect(results[0].priceDifferenceTnd).toBe(2.1);

    expect(results[1].brandName).toBe("PARALYOC");
    expect(results[1].publicPriceTnd).toBe(3.1);
  });
});

describe("Tunisian Price Formatter (TND Millimes)", () => {
  it("formats TND with 3 decimals and DT symbol for French", () => {
    expect(formatTndPrice(4.85, "fr")).toBe("4,850 DT");
    expect(formatTndPrice(3.1, "fr")).toBe("3,100 DT");
  });

  it("formats TND with 3 decimals and د.ت symbol for Arabic", () => {
    expect(formatTndPrice(4.85, "ar")).toBe("4.850 د.ت");
  });
});
