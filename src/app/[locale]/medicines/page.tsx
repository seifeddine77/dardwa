import React from "react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Metadata } from "next";
import { getAllMedicines } from "@/lib/data/repository";
import { MedicineCard } from "@/components/medicine/MedicineCard";
import { MedicineAutocomplete } from "@/components/search/MedicineAutocomplete";
import { DisclaimerNotice } from "@/components/medicine/DisclaimerNotice";
import { Pill, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Répertoire des Médicaments et Génériques en Tunisie",
  description:
    "Consultez les prix officiels en dinars tunisiens, les principes actifs DCI et les alternatives génériques remboursables par la CNAM.",
};

interface MedicinesPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; filter?: string }>;
}

export default async function MedicinesPage({
  params,
  searchParams,
}: MedicinesPageProps) {
  const { locale } = await params;
  const { q, filter } = await searchParams;
  setRequestLocale(locale);

  // Retrieve medicines dynamically from repository
  const medicines = await getAllMedicines({
    q: q?.trim(),
    genericOnly: filter === "generic",
    cnamOnly: filter === "cnam",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <Pill className="h-4 w-4" />
          <span>{locale === "ar" ? "قاعدة بيانات الأدوية" : "Base de données officielle"}</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {locale === "ar"
            ? "دليل الأدوية والبدائل الجنيسة في تونس"
            : "Répertoire des Médicaments & Génériques"}
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          {locale === "ar"
            ? "ابحث عن الأدوية المرخصة في تونس وتحقق من أسعارها العمومية واسترجاع مصاريف الكنام."
            : "Recherchez parmi les spécialités pharmaceutiques autorisées en Tunisie, comparez les prix publics et trouvez des équivalents économiques."}
        </p>

        {/* Live Search Autocomplete */}
        <div className="pt-2">
          <MedicineAutocomplete autoFocus={false} />
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <DisclaimerNotice compact />

      {/* Filter Tabs & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {medicines.length} {locale === "ar" ? "دواء معروض" : "médicament(s) trouvé(s)"}
          </span>
          {q && (
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              « {q} »
            </span>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <a
            href={`/${locale}/medicines${q ? `?q=${encodeURIComponent(q)}` : ""}`}
            className={`px-3 py-1.5 rounded-xl transition ${
              !filter
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {locale === "ar" ? "الكل" : "Tous"}
          </a>
          <a
            href={`/${locale}/medicines?filter=generic${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`px-3 py-1.5 rounded-xl transition ${
              filter === "generic"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {locale === "ar" ? "أدوية جنيسة فقط" : "Génériques uniquement"}
          </a>
          <a
            href={`/${locale}/medicines?filter=cnam${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`px-3 py-1.5 rounded-xl transition ${
              filter === "cnam"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {locale === "ar" ? "استرجاع الكنام" : "Remboursés CNAM"}
          </a>
        </div>
      </div>

      {/* Medicines Grid */}
      {medicines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med) => (
            <MedicineCard key={med.id} medicine={med} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <p className="text-base font-bold text-slate-700">
            Aucun médicament ne correspond à votre recherche « {q} ».
          </p>
          <p className="text-sm text-slate-500">
            Essayez de chercher par principe actif (DCI) tel que Paracétamol ou Amoxicilline.
          </p>
          <div>
            <a
              href={`/${locale}/medicines`}
              className="inline-flex px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Réinitialiser la recherche
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
