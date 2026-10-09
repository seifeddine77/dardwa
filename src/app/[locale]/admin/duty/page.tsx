import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { DutyManagerView } from "@/components/admin/DutyManagerView";
import { HeartPulse, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

import { getAllDutySchedules, getAllPharmacies } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gestion des Gardes - Back-office Administrateur | DarDwa",
  robots: "noindex, nofollow",
};

interface AdminDutyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminDutyPage({ params }: AdminDutyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [schedules, pharmacies] = await Promise.all([
    getAllDutySchedules(),
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

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
          <HeartPulse className="h-4 w-4" />
          <span>Tableau des Gardes Officinales</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Planification des Pharmacies de Garde
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Ajoutez, modifiez ou supprimez les tours de garde de nuit, dimanches et jours fériés par gouvernorat.
        </p>
      </div>

      <DutyManagerView
        locale={locale}
        initialSchedules={schedules}
        initialPharmacies={pharmacies}
      />
    </div>
  );
}
