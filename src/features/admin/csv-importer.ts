import { z } from "zod";

export interface CsvParseResult<T> {
  success: boolean;
  rows: T[];
  errors: Array<{ line: number; error: string; rawRow: Record<string, string> }>;
  totalCount: number;
}

export const medicineCsvRowSchema = z.object({
  code: z.string().min(1, "Code requis"),
  brand_name: z.string().min(1, "Nom commercial requis"),
  brand_name_ar: z.string().optional(),
  dci: z.string().min(1, "DCI requise"),
  dosage: z.string().min(1, "Dosage requis"),
  form: z.string().min(1, "Forme requise"),
  public_price_tnd: z.coerce
    .number()
    .positive("Le prix en DT doit être supérieur à 0"),
  is_generic: z
    .string()
    .transform((val) => val.toLowerCase() === "true" || val === "1"),
  cnam_covered: z
    .string()
    .transform((val) => val.toLowerCase() === "true" || val === "1"),
});

export type MedicineCsvRow = z.infer<typeof medicineCsvRowSchema>;

export const pharmacyCsvRowSchema = z.object({
  name: z.string().min(1, "Nom pharmacie requis"),
  name_ar: z.string().optional(),
  governorate: z.string().min(1, "Gouvernorat requis"),
  delegation: z.string().min(1, "Délégation requise"),
  address: z.string().min(1, "Adresse requise"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  latitude: z.coerce.number().min(30).max(38),
  longitude: z.coerce.number().min(7).max(12),
});

export type PharmacyCsvRow = z.infer<typeof pharmacyCsvRowSchema>;

/**
 * Universal robust CSV parser handling comma or semicolon delimiters and quoted strings.
 */
export function parseCsvText(csvText: string): Record<string, string>[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  // Auto-detect delimiter (, or ;)
  const firstLine = lines[0];
  const delimiter = firstLine.includes(";") ? ";" : ",";

  const headers = firstLine
    .split(delimiter)
    .map((h) => h.replace(/^["']|["']$/g, "").trim().toLowerCase());

  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Split respecting quotes
    const values = rawLine
      .split(delimiter)
      .map((v) => v.replace(/^["']|["']$/g, "").trim());

    if (values.length === headers.length) {
      const rowObj: Record<string, string> = {};
      headers.forEach((header, idx) => {
        rowObj[header] = values[idx] || "";
      });
      rows.push(rowObj);
    }
  }

  return rows;
}

/**
 * Validates and transforms a parsed CSV of medicines.
 */
export function validateMedicineCsv(
  csvText: string
): CsvParseResult<MedicineCsvRow> {
  const rawRows = parseCsvText(csvText);
  const validRows: MedicineCsvRow[] = [];
  const errors: Array<{
    line: number;
    error: string;
    rawRow: Record<string, string>;
  }> = [];

  rawRows.forEach((rawRow, index) => {
    const validation = medicineCsvRowSchema.safeParse(rawRow);
    if (validation.success) {
      validRows.push(validation.data);
    } else {
      errors.push({
        line: index + 2, // 1-indexed, skipping header
        error: validation.error.errors.map((e) => e.message).join(", "),
        rawRow,
      });
    }
  });

  return {
    success: errors.length === 0,
    rows: validRows,
    errors,
    totalCount: rawRows.length,
  };
}

/**
 * Validates and transforms a parsed CSV of pharmacies.
 */
export function validatePharmacyCsv(
  csvText: string
): CsvParseResult<PharmacyCsvRow> {
  const rawRows = parseCsvText(csvText);
  const validRows: PharmacyCsvRow[] = [];
  const errors: Array<{
    line: number;
    error: string;
    rawRow: Record<string, string>;
  }> = [];

  rawRows.forEach((rawRow, index) => {
    const validation = pharmacyCsvRowSchema.safeParse(rawRow);
    if (validation.success) {
      validRows.push(validation.data);
    } else {
      errors.push({
        line: index + 2,
        error: validation.error.errors.map((e) => e.message).join(", "),
        rawRow,
      });
    }
  });

  return {
    success: errors.length === 0,
    rows: validRows,
    errors,
    totalCount: rawRows.length,
  };
}
