import React from "react";
import { Medicine } from "@/types/domain.types";

interface JsonLdDrugProps {
  medicine: Medicine;
  locale: string;
}

/**
 * Generates Schema.org 'Drug' structured data for healthcare SEO.
 * Allows Google and search engines to understand medicine properties.
 */
export const JsonLdDrug: React.FC<JsonLdDrugProps> = ({ medicine, locale }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Drug",
    name: medicine.brandName,
    alternateName: medicine.brandNameAr,
    activeIngredient: medicine.ingredients.map((ing) => ing.name).join(", "),
    dosageForm: medicine.form,
    strengthUnit: medicine.dosage,
    isAvailableGenerically: medicine.isGeneric,
    manufacturer: {
      "@type": "Organization",
      name: medicine.laboratoryName || "Laboratoire Pharmaceutique",
    },
    offers: {
      "@type": "Offer",
      price: medicine.publicPriceTnd.toFixed(3),
      priceCurrency: "TND",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
