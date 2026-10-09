import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { CsvImportView } from "@/components/admin/CsvImportView";
import { FileSpreadsheet, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Importation CSV - Données Pharmaceutiques & Officines | DarDwa",
  robots: "noindex, nofollow",
};

interface AdminImportPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminImportPage({
  params,
}: AdminImportPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour au tableau de bord</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <FileSpreadsheet className="h-4 w-4" />
          <span>Pipeline d&apos;Ingestion de Données</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Importation & Mise à jour par CSV
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Chargez des lots de données officielles conformes au format PCT ou Ordre des Pharmaciens avec prévisualisation et contrôle strict de schéma.
        </p>
      </div>

      {/* Interactive Import View */}
      <CsvImportView locale={locale} />
    </div>
  );
}
