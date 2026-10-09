import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { Database, FileCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { DisclaimerNotice } from "@/components/medicine/DisclaimerNotice";

export const metadata: Metadata = {
  title: "Provenance des Données - DarDwa (دار الدواء)",
  description:
    "Comment DarDwa collecte, vérifie et met à jour les informations sur les médicaments, tarifs et pharmacies en Tunisie.",
};

interface HowDataPageProps {
  params: Promise<{ locale: string }>;
}

export default async function HowDataIsSourcedPage({
  params,
}: HowDataPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {locale === "ar" ? "كيف يتم جمع وتحديث البيانات ؟" : "Provenance & Fiabilité des Données"}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {locale === "ar"
            ? "نحرص على أقصى درجات الشفافية فيما يتعلق بمصادر البيانات الرسمية والمجتمعية."
            : "Une transparence totale sur l'origine des nomenclatures, des prix publics et des horaires d'officines en Tunisie."}
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-600" />
            <span>1. Nomenclature & Prix des Médicaments</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Les fiches médicaments, principes actifs (DCI), dosages et prix publics réglementés en dinars tunisiens sont basés sur les publications officielles de la <strong>Pharmacie Centrale de Tunisie (PCT)</strong> et de la <strong>Direction de la Pharmacie et du Médicament (DPM)</strong>.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-blue-600" />
            <span>2. Prise en Charge CNAM</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Les indications de remboursement et les tarifs conventionnels de référence sont issus des référentiels publics de la <strong>Caisse Nationale d&apos;Assurance Maladie (CNAM Tunisie)</strong>.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-purple-600" />
            <span>3. Signalements de Disponibilité (Filtre 48h)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Les disponibilités locales sont alimentées par la communauté des utilisateurs. Tout signalement expire automatiquement après <strong>48 heures</strong> pour garantir que seules des informations récentes et vérifiables sont présentées.
          </p>
        </div>
      </div>

      <DisclaimerNotice />
    </div>
  );
}
