import { describe, it, expect } from "vitest";
import {
  detectIllegalMedicineExchange,
  volunteerApplicationSchema,
} from "@/features/solidarity/solidarity-service";

describe("Solidarity Module - Illegal P2P Medicine Exchange Blocker", () => {
  it("detects and blocks prohibited French sales/exchange phrases", () => {
    const attempt1 = detectIllegalMedicineExchange("Je vends une boîte de Doliprane");
    expect(attempt1.isBlocked).toBe(true);

    const attempt2 = detectIllegalMedicineExchange("Cherche don ou échange de Spasfon");
    expect(attempt2.isBlocked).toBe(true);
  });

  it("detects and blocks prohibited Tunisian Arabic sales/exchange phrases", () => {
    const attemptAr = detectIllegalMedicineExchange("عندي دواء للبيع في تونس");
    expect(attemptAr.isBlocked).toBe(true);
  });

  it("permits legitimate volunteer and healthcare discussions", () => {
    const legit = detectIllegalMedicineExchange(
      "Je souhaite participer bénévolement à la saisie des données PCT."
    );
    expect(legit.isBlocked).toBe(false);
  });
});

describe("Volunteer Application Schema Validation", () => {
  it("validates legitimate volunteer submission", () => {
    const valid = {
      fullName: "Anis Khemir",
      governorate: "Sousse",
      email: "anis@example.tn",
      role: "translation",
      motivation: "Je souhaite traduire les fiches médicaments en dialecte tunisien.",
    };

    const parsed = volunteerApplicationSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("rejects volunteer application containing illicit sales attempts in motivation", () => {
    const illicit = {
      fullName: "Spammer",
      governorate: "Tunis",
      email: "spam@example.tn",
      role: "user_support",
      motivation: "Je vends des médicaments sous le manteau",
    };

    const parsed = volunteerApplicationSchema.safeParse(illicit);
    expect(parsed.success).toBe(false);
  });
});
