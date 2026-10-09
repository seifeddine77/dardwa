import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PharmacyCard } from "@/components/pharmacy/PharmacyCard";
import { Pharmacy } from "@/types/domain.types";

const mockPharmacy: Pharmacy = {
  id: "pharm-1",
  name: "Pharmacie Centrale de Tunis",
  nameAr: "صيدلية تونس المركزية",
  governorate: "Tunis",
  delegation: "Bab El Bhar",
  address: "Avenue Habib Bourguiba, Tunis",
  postalCode: "1000",
  phone: "+216 71 245 100",
  phoneEmergency: "+216 71 245 101",
  latitude: 36.8002,
  longitude: 10.1815,
  isNightShiftCapable: true,
  isVerified: true,
};

describe("PharmacyCard Component", () => {
  it("renders pharmacy details, address, and tap-to-call link", () => {
    render(<PharmacyCard pharmacy={mockPharmacy} locale="fr" distanceKm={1.5} />);

    expect(screen.getByText("Pharmacie Centrale de Tunis")).toBeInTheDocument();
    expect(screen.getByText("صيدلية تونس المركزية")).toBeInTheDocument();
    expect(screen.getByText("1,5 km")).toBeInTheDocument();

    const phoneLink = screen.getByRole("link", { name: /\+216 71 245 100/i });
    expect(phoneLink).toHaveAttribute("href", "tel:+21671245100");

    const emergencyLink = screen.getByRole("link", { name: /urgence/i });
    expect(emergencyLink).toHaveAttribute("href", "tel:+21671245101");
  });

  it("renders 24h duty badge when dutyType is continuous_24h", () => {
    render(
      <PharmacyCard
        pharmacy={mockPharmacy}
        locale="fr"
        dutyType="continuous_24h"
      />
    );

    expect(screen.getByText("Ouvert 24h/24")).toBeInTheDocument();
  });

  it("renders Arabic labels when locale is ar", () => {
    render(
      <PharmacyCard
        pharmacy={mockPharmacy}
        locale="ar"
        dutyType="night"
        distanceKm={0.6}
      />
    );

    expect(screen.getByText("استمرار ليلي")).toBeInTheDocument();
    expect(screen.getByText("600 م")).toBeInTheDocument();
  });
});
