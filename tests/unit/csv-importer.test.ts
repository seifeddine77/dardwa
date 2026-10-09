import { describe, it, expect } from "vitest";
import {
  parseCsvText,
  validateMedicineCsv,
  validatePharmacyCsv,
} from "@/features/admin/csv-importer";

describe("CSV Text Parser Engine", () => {
  it("parses comma-separated values into records", () => {
    const csv = `name,governorate,phone\nPharmacie A,Tunis,71245100\nPharmacie B,Sousse,73227400`;
    const rows = parseCsvText(csv);

    expect(rows).toHaveLength(2);
    expect(rows[0].name).toBe("Pharmacie A");
    expect(rows[0].governorate).toBe("Tunis");
    expect(rows[1].name).toBe("Pharmacie B");
  });

  it("auto-detects semicolon delimiter", () => {
    const csv = `code;brand_name;price\nPCT-01;DOLIPRANE;4.850\nPCT-02;ALGODOL;2.750`;
    const rows = parseCsvText(csv);

    expect(rows).toHaveLength(2);
    expect(rows[0].code).toBe("PCT-01");
    expect(rows[0].brand_name).toBe("DOLIPRANE");
  });

  it("handles empty or single line CSV gracefully", () => {
    expect(parseCsvText("")).toEqual([]);
    expect(parseCsvText("header_only")).toEqual([]);
  });
});

describe("Medicine CSV Validation", () => {
  it("validates valid medicine CSV rows", () => {
    const csv = `code,brand_name,brand_name_ar,dci,dosage,form,public_price_tnd,is_generic,cnam_covered\nPCT-1,DOLIPRANE,دوليبران,PARACETAMOL,1000 mg,Comprimé,4.850,false,true`;
    const result = validateMedicineCsv(csv);

    expect(result.success).toBe(true);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].brand_name).toBe("DOLIPRANE");
    expect(result.rows[0].public_price_tnd).toBe(4.85);
    expect(result.rows[0].is_generic).toBe(false);
    expect(result.rows[0].cnam_covered).toBe(true);
  });

  it("catches errors with accurate line numbers on invalid rows", () => {
    const csv = `code,brand_name,brand_name_ar,dci,dosage,form,public_price_tnd,is_generic,cnam_covered\n,DOLIPRANE,,PARACETAMOL,1000 mg,Comprimé,invalid_price,false,true`;
    const result = validateMedicineCsv(csv);

    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].line).toBe(2);
    expect(result.errors[0].error).toContain("Code requis");
  });
});

describe("Pharmacy CSV Validation", () => {
  it("validates pharmacy coordinates within Tunisian boundaries", () => {
    const csv = `name,name_ar,governorate,delegation,address,phone,latitude,longitude\nPharmacie Centrale,صيدلية,Tunis,Bab El Bhar,Av Bourguiba,71245100,36.8002,10.1815`;
    const result = validatePharmacyCsv(csv);

    expect(result.success).toBe(true);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].latitude).toBe(36.8002);
    expect(result.rows[0].longitude).toBe(10.1815);
  });

  it("rejects coordinates outside Tunisia or invalid fields", () => {
    const csv = `name,name_ar,governorate,delegation,address,phone,latitude,longitude\nPharmacie Hors Zone,,Tunis,Bab El Bhar,Av Bourguiba,71245100,48.8566,2.3522`; // Paris coordinates
    const result = validatePharmacyCsv(csv);

    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
  });
});
