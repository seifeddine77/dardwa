import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { EquivalentCard } from "@/components/medicine/EquivalentCard";
import { JsonLdDrug } from "@/components/medicine/JsonLdDrug";
import { MedicineCard } from "@/components/medicine/MedicineCard";
import { GenericEquivalent, Medicine } from "@/types/domain.types";
import frMessages from "@/i18n/messages/fr.json";
import arMessages from "@/i18n/messages/ar.json";

const mockEquivalent: GenericEquivalent = {
  id: "eq-1",
  brandName: "ALGODOL 1000",
  brandNameAr: "الغولودول 1000",
  dosage: "1000 mg",
  form: "Comprimé",
  publicPriceTnd: 2.75,
  priceDifferenceTnd: 2.1,
  percentageSavings: 43.3,
  isGeneric: true,
  cnamCovered: true,
  laboratoryName: "ADWYA",
};

const mockMedicine: Medicine = {
  id: "med-1",
  code: "PCT-001",
  brandName: "DOLIPRANE 1000",
  brandNameAr: "دوليبران 1000",
  dosage: "1000 mg",
  dosageMg: 1000,
  form: "Comprimé",
  formCategory: "tablet",
  presentation: "Boîte de 8",
  laboratoryName: "SANOFI TUNISIE",
  publicPriceTnd: 4.85,
  isGeneric: false,
  cnamCovered: true,
  cnamReferenceTariff: 3.2,
  lastUpdatedAt: "2026-01-15",
  isActive: true,
  ingredients: [{ id: "c1", name: "PARACETAMOL", nameAr: "باراسيتامول" }],
};

describe("EquivalentCard Component", () => {
  it("renders brand name, laboratory and economic savings in DT", () => {
    render(
      <NextIntlClientProvider locale="fr" messages={frMessages}>
        <EquivalentCard equivalent={mockEquivalent} locale="fr" />
      </NextIntlClientProvider>
    );

    expect(screen.getByText("ALGODOL 1000")).toBeInTheDocument();
    expect(
      screen.getByText("Laboratoire ADWYA", { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText("Économie : 2,100 DT (43.3%)")).toBeInTheDocument();
    expect(screen.getByText("2,750 DT")).toBeInTheDocument();
  });

  it("renders Arabic savings when locale is ar", () => {
    render(
      <NextIntlClientProvider locale="ar" messages={arMessages}>
        <EquivalentCard equivalent={mockEquivalent} locale="ar" />
      </NextIntlClientProvider>
    );

    expect(screen.getByText("توفير: 2.100 د.ت (43.3%)")).toBeInTheDocument();
    expect(screen.getByText("2.750 د.ت")).toBeInTheDocument();
  });
});

describe("JsonLdDrug Component", () => {
  it("outputs valid Schema.org Drug JSON-LD", () => {
    const { container } = render(
      <JsonLdDrug medicine={mockMedicine} locale="fr" />
    );

    const script = container.querySelector(
      "script[type='application/ld+json']"
    );
    expect(script).not.toBeNull();
    const json = JSON.parse(script?.textContent || "{}");

    expect(json["@type"]).toBe("Drug");
    expect(json.name).toBe("DOLIPRANE 1000");
    expect(json.activeIngredient).toBe("PARACETAMOL");
    expect(json.offers.price).toBe("4.850");
    expect(json.offers.priceCurrency).toBe("TND");
  });
});

describe("MedicineCard Component", () => {
  it("renders medicine card with price, code, and DCI", () => {
    render(
      <NextIntlClientProvider locale="fr" messages={frMessages}>
        <MedicineCard medicine={mockMedicine} locale="fr" />
      </NextIntlClientProvider>
    );

    expect(screen.getByText("DOLIPRANE 1000")).toBeInTheDocument();
    expect(screen.getByText("PCT-001")).toBeInTheDocument();
    expect(screen.getByText("4,850 DT")).toBeInTheDocument();
    expect(screen.getByText("Princeps")).toBeInTheDocument();
  });
});
