import { Medicine } from "@/types/domain.types";
import { SEED_MEDICINES } from "@/lib/data/mock-dataset";

export interface SearchResult {
  medicine: Medicine;
  score: number;
  matchedOn: "brand" | "dci" | "fuzzy";
}

/**
 * Normalizes French and Arabic strings for accent- and diacritic-insensitive search.
 */
export function normalizeSearchString(text: string): string {
  if (!text) return "";

  return (
    text
      // 1. Decompose characters into base letters + combining marks
      .normalize("NFD")
      // 2. Remove all combining marks (Latin accents, Arabic Tashkeel & combining Hamza)
      .replace(/\p{M}/gu, "")
      // 3. Normalize remaining precomposed Arabic letter forms
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/[يى]/g, "ي")
      // 4. Case and whitespace
      .toLowerCase()
      .trim()
  );
}

/**
 * Computes trigrams for fuzzy typo tolerance (same logic as PostgreSQL pg_trgm).
 */
export function getTrigrams(text: string): Set<string> {
  const normalized = `  ${normalizeSearchString(text)} `;
  const trigrams = new Set<string>();
  for (let i = 0; i < normalized.length - 2; i++) {
    trigrams.add(normalized.substring(i, i + 3));
  }
  return trigrams;
}

/**
 * Calculates trigram similarity between 0.0 and 1.0.
 */
export function calculateTrigramSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const triA = getTrigrams(a);
  const triB = getTrigrams(b);

  if (triA.size === 0 || triB.size === 0) return 0;

  let intersection = 0;
  for (const tri of triA) {
    if (triB.has(tri)) {
      intersection++;
    }
  }

  return (2 * intersection) / (triA.size + triB.size);
}

/**
 * Executes fast typo-, accent-, and Arabic-tolerant search over medicines.
 */
export function searchMedicinesInMemory(
  query: string,
  catalog: Medicine[] = SEED_MEDICINES,
  limit: number = 20
): SearchResult[] {
  const cleanQuery = normalizeSearchString(query);
  if (!cleanQuery || cleanQuery.length < 1) {
    return [];
  }

  const results: SearchResult[] = [];

  for (const med of catalog) {
    if (!med.isActive) continue;

    const brandNorm = normalizeSearchString(med.brandName);
    const brandArNorm = normalizeSearchString(med.brandNameAr || "");

    let bestScore = 0;
    let matchType: "brand" | "dci" | "fuzzy" = "fuzzy";

    // 1. Exact or prefix match on Brand Name
    if (brandNorm === cleanQuery || brandArNorm === cleanQuery) {
      bestScore = 1.0;
      matchType = "brand";
    } else if (brandNorm.startsWith(cleanQuery) || brandArNorm.startsWith(cleanQuery)) {
      bestScore = 0.85;
      matchType = "brand";
    } else if (brandNorm.includes(cleanQuery) || brandArNorm.includes(cleanQuery)) {
      bestScore = 0.7;
      matchType = "brand";
    }

    // 2. Match on Active Ingredients (DCI)
    for (const ing of med.ingredients) {
      const dciNorm = normalizeSearchString(ing.name);
      const dciArNorm = normalizeSearchString(ing.nameAr || "");

      if (dciNorm === cleanQuery || dciArNorm === cleanQuery) {
        if (bestScore < 0.95) {
          bestScore = 0.95;
          matchType = "dci";
        }
      } else if (dciNorm.startsWith(cleanQuery) || dciArNorm.startsWith(cleanQuery)) {
        if (bestScore < 0.8) {
          bestScore = 0.8;
          matchType = "dci";
        }
      } else if (dciNorm.includes(cleanQuery) || dciArNorm.includes(cleanQuery)) {
        if (bestScore < 0.65) {
          bestScore = 0.65;
          matchType = "dci";
        }
      }
    }

    // 3. Typo-tolerant fuzzy matching (Trigrams) if score is low
    if (bestScore < 0.5) {
      const brandSim = Math.max(
        calculateTrigramSimilarity(brandNorm, cleanQuery),
        calculateTrigramSimilarity(brandArNorm, cleanQuery)
      );

      let dciSim = 0;
      for (const ing of med.ingredients) {
        const sim = Math.max(
          calculateTrigramSimilarity(normalizeSearchString(ing.name), cleanQuery),
          calculateTrigramSimilarity(normalizeSearchString(ing.nameAr || ""), cleanQuery)
        );
        if (sim > dciSim) dciSim = sim;
      }

      const maxSim = Math.max(brandSim, dciSim);
      if (maxSim >= 0.28) {
        bestScore = maxSim * 0.6;
        matchType = brandSim >= dciSim ? "brand" : "dci";
      }
    }

    if (bestScore > 0) {
      results.push({
        medicine: med,
        score: bestScore,
        matchedOn: matchType,
      });
    }
  }

  // Sort by score descending, then price ascending
  return results
    .sort((a, b) => {
      if (Math.abs(b.score - a.score) > 0.05) {
        return b.score - a.score;
      }
      return a.medicine.publicPriceTnd - b.medicine.publicPriceTnd;
    })
    .slice(0, limit);
}
