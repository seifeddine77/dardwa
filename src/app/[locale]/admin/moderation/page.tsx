import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { getAllReports } from "@/features/reports/reports-service";
import { SEED_MEDICINES, SEED_PHARMACIES } from "@/lib/data/mock-dataset";
import { ShieldCheck, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

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

  const reports = getAllReports();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
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
            Validez, rejetez ou auditez les signalements communautaires de disponibilité (TTL 48h).
          </p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="px-5 py-3.5 text-start">Médicament</th>
                <th className="px-5 py-3.5 text-start">Pharmacie</th>
                <th className="px-5 py-3.5 text-start">Statut</th>
                <th className="px-5 py-3.5 text-start">Date de signalement</th>
                <th className="px-5 py-3.5 text-start">Expiration (48h)</th>
                <th className="px-5 py-3.5 text-start">Modération</th>
                <th className="px-5 py-3.5 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => {
                const med = SEED_MEDICINES.find((m) => m.id === report.medicineId);
                const pharm = SEED_PHARMACIES.find((p) => p.id === report.pharmacyId);

                return (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {med ? `${med.brandName} (${med.dosage})` : report.medicineId}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {pharm ? `${pharm.name} (${pharm.governorate})` : report.pharmacyId}
                    </td>
                    <td className="px-5 py-4">
                      {report.status === "available" ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Disponible
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold inline-flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          En rupture
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(report.createdAt).toLocaleString("fr-TN")}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(report.expiresAt).toLocaleString("fr-TN")}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold">
                        {report.moderationStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-end space-x-2">
                      <button
                        type="button"
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 transition"
                      >
                        Approuver
                      </button>
                      <button
                        type="button"
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-lg border border-rose-200 transition"
                      >
                        Rejeter
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
