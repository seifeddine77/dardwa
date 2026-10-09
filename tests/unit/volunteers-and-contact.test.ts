import { describe, it, expect } from "vitest";
import {
  volunteerApplicationSchema,
  detectIllegalMedicineExchange,
} from "@/features/solidarity/solidarity-service";

describe("Solidarity & Volunteer Form Validation", () => {
  it("accepts valid volunteer application", () => {
    const valid = {
      fullName: "Yasmine Mansour",
      governorate: "Tunis",
      email: "yasmine@example.tn",
      role: "reporting_verification",
      motivation: "Je souhaite aider bénévolement à vérifier les disponibilités.",
    };

    const result = volunteerApplicationSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("blocks volunteer motivation containing illegal medicine trade keywords (French)", () => {
    const invalid = {
      fullName: "Foued T.",
      governorate: "Sousse",
      email: "foued@example.tn",
      role: "reporting_verification",
      motivation: "Je vends du doliprane à prix à discuter contactez moi",
    };

    const result = volunteerApplicationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("blocks volunteer motivation containing illegal medicine trade keywords (Arabic)", () => {
    const invalid = {
      fullName: "علي التونسي",
      governorate: "Sfax",
      email: "ali@example.tn",
      role: "reporting_verification",
      motivation: "شكون عندو دواء للبيع عندي كميات متوفرة",
    };

    const result = volunteerApplicationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
