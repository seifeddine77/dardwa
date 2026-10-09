import { AiProvider, BoxScanResult, boxScanResultSchema } from "./types";
import { searchMedicinesInMemory } from "@/features/search/search-service";
import { Medicine } from "@/types/domain.types";
import { SEED_MEDICINES } from "@/lib/data/mock-dataset";

// In-memory Mock Provider
export class MockAiProvider implements AiProvider {
  readonly providerName = "MockAI";

  async extractMedicineFromBox(imageBase64: string): Promise<BoxScanResult> {
    // If prompt injection attempt simulated
    if (imageBase64.includes("INJECTION_TEST")) {
      return {
        brandName: "DOLIPRANE",
        dosage: "1000 mg",
        form: "Comprimé",
        confidence: 0.95,
      };
    }

    if (imageBase64.includes("MALFORMED_TEST")) {
      throw new Error("Malformed LLM response");
    }

    return {
      brandName: "DOLIPRANE 1000",
      dosage: "1000 mg",
      form: "Comprimé",
      confidence: 0.92,
    };
  }
}

/**
 * Feature flag check (off by default)
 */
export function isAiEnabled(): boolean {
  return process.env.ENABLE_AI_FEATURES === "true";
}

export interface BoxScanMatchResponse {
  success: boolean;
  rawExtracted: BoxScanResult | null;
  matchedMedicine: Medicine | null;
  error?: string;
}

/**
 * Executes medicine box scan with strict prompt-injection guardrails,
 * timeouts, and fuzzy-matching against internal database only.
 */
export async function processBoxScan(
  imageBase64: string,
  provider: AiProvider = new MockAiProvider(),
  timeoutMs: number = 8000
): Promise<BoxScanMatchResponse> {
  // Never process empty input
  if (!imageBase64 || imageBase64.trim().length === 0) {
    return {
      success: false,
      rawExtracted: null,
      matchedMedicine: null,
      error: "Image requise pour l'analyse",
    };
  }

  try {
    // 1. Timeout wrapper
    const extractionPromise = provider.extractMedicineFromBox(imageBase64);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Délai d'attente IA dépassé (timeout)")), timeoutMs)
    );

    const raw = await Promise.race([extractionPromise, timeoutPromise]);

    // 2. Strict Zod Validation (guards against LLM hallucinations/injections)
    const validated = boxScanResultSchema.safeParse(raw);
    if (!validated.success) {
      return {
        success: false,
        rawExtracted: null,
        matchedMedicine: null,
        error: "Format d'extraction non conforme",
      };
    }

    // 3. HARD RULE: Fuzzy-match ONLY against OUR verified database.
    // Price and substitutions come purely from the database, NEVER from AI.
    const searchHits = searchMedicinesInMemory(
      validated.data.brandName,
      SEED_MEDICINES,
      1
    );

    const matchedMedicine = searchHits.length > 0 ? searchHits[0].medicine : null;

    return {
      success: true,
      rawExtracted: validated.data,
      matchedMedicine,
    };
  } catch (err: any) {
    return {
      success: false,
      rawExtracted: null,
      matchedMedicine: null,
      error: err.message || "Échec de l'analyse IA de l'image",
    };
  }
}
