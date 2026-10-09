import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import {
  getAllMedicines,
  getAllPharmacies,
  getAllDutySchedules,
  getAllReports,
} from "@/lib/data/repository";
import {
  ShieldCheck,
  FileSpreadsheet,
  HeartPulse,
  Users,
  Pill,
  Building,
  ArrowRight,
  Database,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tableau de Bord Administrateur - DarDwa",
  robots: "noindex, nofollow",
};

interface AdminDashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminDashboardPage({
  params,
}: AdminDashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [medicines, pharmacies, dutySchedules, reports] = await Promise.all([
    getAllMedicines(),
    getAllPharmacies(),
    getAllDutySchedules(),
    getAllReports(),
  ]);

  const medicinesCount = medicines.length;
  const pharmaciesCount = pharmacies.length;
  const dutyCount = dutySchedules.length;
  const reportsCount = reports.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Administration DarDwa (دار الدواء)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Tableau de Bord & Gestion
        </h1>
        <p className="text-sm text-slate-500">
          Supervisez le référentiel des médicaments, la cartographie des officines, les gardes et les signalements.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Médicaments</span>
            <Pill className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{medicinesCount}</div>
          <span className="text-[10px] text-emerald-700 font-bold">Catalogue actif</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Pharmacies</span>
            <Building className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{pharmaciesCount}</div>
          <span className="text-[10px] text-blue-700 font-bold">Officines WGS84</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Gardes</span>
            <HeartPulse className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{dutyCount}</div>
          <span className="text-[10px] text-purple-700 font-bold">Plannings actifs</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Signalements</span>
            <Users className="h-5 w-5 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{reportsCount}</div>
          <span className="text-[10px] text-amber-700 font-bold">File communautaire</span>
        </div>
      </div>

      {/* Modules Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: CSV Importer */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Import & Mise à jour CSV
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Importez en lot les médicaments de la Pharmacie Centrale de Tunisie (PCT) et l&apos;annuaire des pharmacies.
            </p>
          </div>
          <Link
            href="/admin/import"
            className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            <span>Ouvrir l&apos;importateur</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Module 2: Duty Manager */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <HeartPulse className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Gestion des Gardes
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Planifiez les pharmacies de garde de nuit, les dimanches et les jours fériés par gouvernorat.
            </p>
          </div>
          <Link
            href="/admin/duty"
            className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            <span>Gérer les plannings</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Module 3: Moderation */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Modération des Signalements
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Vérifiez les signalements citoyens, filtrez les spams et contrôlez la file de modération 48h.
            </p>
          </div>
          <Link
            href="/admin/moderation"
            className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            <span>Ouvrir la modération</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
