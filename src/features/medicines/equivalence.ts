import { Medicine, GenericEquivalent } from "@/types/domain.types";

/**
 * Checks if two medicines are therapeutically equivalent for substitution.
 * Requires:
 * 1. Identical active ingredient(s) (DCI).
 * 2. Identical normalized active dosage (mg).
 * 3. Compatible pharmaceutical form category.
 */
export function areMedicinesEquivalent(a: Medicine, b: Medicine): boolean {
  if (a.id === b.id) return false;

  // 1. Check dosage compatibility (must match if defined)
  if (a.dosageMg && b.dosageMg && Math.abs(a.dosageMg - b.dosageMg) > 0.001) {
    return false;
  }

  // 2. Form category compatibility
  if (a.formCategory !== b.formCategory) {
    return false;
  }

  // 3. Compare active ingredients (DCI) sets
  const dciSetA = a.ingredients.map((i) => i.name.trim().toUpperCase()).sort();
  const dciSetB = b.ingredients.map((i) => i.name.trim().toUpperCase()).sort();

  if (dciSetA.length !== dciSetB.length) {
    return false;
  }

  for (let i = 0; i < dciSetA.length; i++) {
    if (dciSetA[i] !== dciSetB[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Calculates economic savings between a reference medicine and an alternative.
 */
export function calculateSavings(
  referencePriceTnd: number,
  alternativePriceTnd: number
): { priceDifferenceTnd: number; percentageSavings: number } {
  if (referencePriceTnd <= 0) {
    return { priceDifferenceTnd: 0, percentageSavings: 0 };
  }

  const diff = referencePriceTnd - alternativePriceTnd;
  const priceDifferenceTnd = Number(Math.max(0, diff).toFixed(3));
  const percentageSavings = Number(
    Math.max(0, (diff / referencePriceTnd) * 100).toFixed(1)
  );

  return { priceDifferenceTnd, percentageSavings };
}

/**
 * Finds all equivalent medicines from a catalog, filters for cheaper alternatives,
 * and sorts them by price ascending.
 */
export function findCheaperEquivalents(
  target: Medicine,
  catalog: Medicine[]
): GenericEquivalent[] {
  return catalog
    .filter((candidate) => areMedicinesEquivalent(target, candidate))
    .filter((candidate) => candidate.publicPriceTnd < target.publicPriceTnd)
    .map((candidate) => {
      const { priceDifferenceTnd, percentageSavings } = calculateSavings(
        target.publicPriceTnd,
        candidate.publicPriceTnd
      );

      return {
        id: candidate.id,
        brandName: candidate.brandName,
        brandNameAr: candidate.brandNameAr,
        dosage: candidate.dosage,
        form: candidate.form,
        publicPriceTnd: candidate.publicPriceTnd,
        priceDifferenceTnd,
        percentageSavings,
        isGeneric: candidate.isGeneric,
        cnamCovered: candidate.cnamCovered,
        laboratoryName: candidate.laboratoryName,
      };
    })
    .sort((a, b) => a.publicPriceTnd - b.publicPriceTnd);
}

/**
 * Formats a Tunisian Dinar amount (3 decimal places / millimes).
 */
export function formatTndPrice(amount: number, locale: string = "fr"): string {
  const formatted = amount.toFixed(3);
  if (locale === "ar") {
    return `${formatted} د.ت`;
  }
  return `${formatted.replace(".", ",")} DT`;
}
