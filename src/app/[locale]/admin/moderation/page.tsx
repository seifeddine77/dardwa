import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import {
  getAllReports,
  getAllMedicines,
  getAllPharmacies,
} from "@/lib/data/repository";
import { ModerationQueueView } from "@/components/admin/ModerationQueueView";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Modération des Signalements - Back-office DarDwa",
  robots: "noindex, nofollow",
};

interface ModerationPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ModerationPage({ params }: ModerationPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [reports, medicines, pharmacies] = await Promise.all([
    getAllReports(),
    getAllMedicines(),
    getAllPharmacies(),
  ]);

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

      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Espace Modération Administrateur</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            File de Modération des Signalements
          </h1>
          <p className="text-sm text-slate-500">
            Validez, rejetez ou auditez les signalements communautaires de disponibilité (TTL 48h) en temps réel.
          </p>
        </div>
      </div>

      {/* Interactive Reports Table */}
      <ModerationQueueView
        initialReports={reports}
        medicines={medicines}
        pharmacies={pharmacies}
        locale={locale}
      />
    </div>
  );
}
