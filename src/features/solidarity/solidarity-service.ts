import { z } from "zod";

export interface SolidarityOrg {
  id: string;
  name: string;
  category: "collecte_legale" | "association_patients" | "aide_sociale";
  governorate: string;
  phone: string;
  address: string;
  source: string;
  lastVerifiedAt: string;
}

export const VETTED_ORGANIZATIONS: SolidarityOrg[] = [
  {
    id: "org-1",
    name: "Croissant-Rouge Tunisien (Comité National)",
    category: "collecte_legale",
    governorate: "Tunis",
    phone: "+216 71 325 572",
    address: "19 Rue d'Angleterre, Tunis",
    source: "Registre officiel des ONG caritatives",
    lastVerifiedAt: "2026-02-01",
  },
  {
    id: "org-2",
    name: "Association Tunisienne des Diabétiques",
    category: "association_patients",
    governorate: "Tunis",
    phone: "+216 71 570 120",
    address: "Bab Saadoun, Tunis",
    source: "Ministère de la Santé",
    lastVerifiedAt: "2026-01-20",
  },
  {
    id: "org-3",
    name: "Croissant-Rouge Tunisien (Comité Régional Sousse)",
    category: "collecte_legale",
    governorate: "Sousse",
    phone: "+216 73 225 110",
    address: "Avenue Léopold Senghor, Sousse",
    source: "Registre officiel",
    lastVerifiedAt: "2026-01-15",
  },
  {
    id: "org-4",
    name: "Croissant-Rouge Tunisien (Comité Régional Sfax)",
    category: "collecte_legale",
    governorate: "Sfax",
    phone: "+216 74 298 440",
    address: "Route de Téniour, Sfax",
    source: "Registre officiel",
    lastVerifiedAt: "2026-01-10",
  },
];

/**
 * HARD RULE: Strict filter detecting and blocking any attempt to sell,
 * exchange or donate medicines between individuals (P2P), strictly prohibited
 * by Tunisian pharmacy law and public health safety regulations.
 */
const FORBIDDEN_P2P_PATTERNS = [
  /\b(je\s+vends|a\s+vendre|à\s+vendre|prix\s+a\s+discuter|echange|échange|qui\s+a\s+du|cherche\s+don)\b/i,
  /(للبيع|شكون\s+عندو|عندي\s+دواء\s+للبيع|تبادل\s+أدوية|شكون\s+يبيع)/i,
];

export function detectIllegalMedicineExchange(text: string): {
  isBlocked: boolean;
  reason?: string;
} {
  for (const pattern of FORBIDDEN_P2P_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isBlocked: true,
        reason:
          "La vente, l'achat ou l'échange de médicaments entre particuliers est strictement interdit par la loi tunisienne pour des raisons impératives de sécurité sanitaire.",
      };
    }
  }

  return { isBlocked: false };
}

export const volunteerApplicationSchema = z.object({
  fullName: z.string().min(3, "Nom complet requis"),
  governorate: z.string().min(2, "Gouvernorat requis"),
  email: z.string().email("Email valide requis"),
  role: z.enum([
    "reporting_verification",
    "translation",
    "data_cleaning",
    "user_support",
  ]),
  motivation: z
    .string()
    .min(10, "Motivation trop courte")
    .max(500, "Motivation trop longue")
    .refine((text) => !detectIllegalMedicineExchange(text).isBlocked, {
      message:
        "Le texte contient des mots-clés interdits relatifs aux échanges de médicaments.",
    }),
});

export type VolunteerApplicationInput = z.infer<
  typeof volunteerApplicationSchema
>;
