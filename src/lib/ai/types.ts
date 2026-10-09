import { z } from "zod";

/**
 * Strictly validated Zod schema for box OCR scanning.
 * HARD RULE: The LLM can ONLY extract brand name, dosage and form.
 * The LLM must NEVER output prices, substitutions, availability, or dosage advice.
 */
export const boxScanResultSchema = z.object({
  brandName: z.string().min(2, "Nom de spécialité extrait trop court").max(100),
  dosage: z.string().max(50).optional(),
  form: z.string().max(50).optional(),
  confidence: z.number().min(0).max(1).default(0.8),
});

export type BoxScanResult = z.infer<typeof boxScanResultSchema>;

export interface AiProvider {
  readonly providerName: string;
  extractMedicineFromBox(imageBase64: string): Promise<BoxScanResult>;
  generateSearchEmbedding?(query: string): Promise<number[]>;
}
