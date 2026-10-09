"use client";

import React, { useState } from "react";
import { AvailabilityReport, Pharmacy } from "@/types/domain.types";
import { ReportFormModal } from "@/components/report/ReportFormModal";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  PlusCircle,
  Building,
  AlertCircle,
} from "lucide-react";

interface MedicineAvailabilitySectionProps {
  medicineId: string;
  medicineName: string;
  reports: AvailabilityReport[];
  pharmacies: Pharmacy[];
  locale: string;
}

export const MedicineAvailabilitySection: React.FC<
  MedicineAvailabilitySectionProps
> = ({ medicineId, medicineName, reports: initialReports, pharmacies, locale }) => {
  const [reports, setReports] = useState<AvailabilityReport[]>(initialReports);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const availableReports = reports.filter((r) => r.status === "available");
  const outOfStockReports = reports.filter((r) => r.status === "out_of_stock");

  const computedStatus =
    reports.length === 0
      ? "unknown"
      : availableReports.length >= outOfStockReports.length
      ? "available"
      : "out_of_stock";

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {locale === "ar" ? "حالة التوفر المجتمعية" : "Disponibilité collaborative"}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              48h TTL
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {locale === "ar"
              ? "مخزون الدواء في الصيدليات القريبة"
              : "Disponibilité signalée par les citoyens"}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>
            {locale === "ar"
              ? "إبلاغ عن توفر أو فقدان"
              : "Signaler la disponibilité"}
          </span>
        </button>
      </div>

      {/* Status banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 ${
            computedStatus === "available"
              ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
              : computedStatus === "out_of_stock"
              ? "bg-rose-50/80 border-rose-200 text-rose-900"
              : "bg-slate-50 border-slate-200 text-slate-700"
          }`}
        >
          {computedStatus === "available" && (
            <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
          )}
          {computedStatus === "out_of_stock" && (
            <XCircle className="h-6 w-6 text-rose-600 shrink-0" />
          )}
          {computedStatus === "unknown" && (
            <HelpCircle className="h-6 w-6 text-slate-400 shrink-0" />
          )}

          <div>
            <span className="text-xs font-bold block">
              {computedStatus === "available"
                ? locale === "ar" ? "أغلبية الإبلاغات: متوفر" : "Tendance : Signalé disponible"
                : computedStatus === "out_of_stock"
                ? locale === "ar" ? "أغلبية الإبلاغات: في حالة نقص" : "Tendance : Signalé en rupture"
                : locale === "ar" ? "لا توجد إبلاغات حديثة" : "Aucun signalement récent"}
            </span>
            <span className="text-[11px] opacity-75">
              {reports.length}{" "}
              {locale === "ar"
                ? "إبلاغ في آخر 48 ساعة"
                : `signalement(s) actif(s)`}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-3">
          <Clock className="h-5 w-5 text-slate-400 shrink-0" />
          <div>
            <span className="text-xs font-bold block">
              {availableReports.length} {locale === "ar" ? "متوفر" : "disponible(s)"}
            </span>
            <span className="text-[11px] text-slate-400">
              {outOfStockReports.length} {locale === "ar" ? "في حالة نقص" : "en rupture"}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-900 flex items-center gap-2 text-xs">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-[11px] leading-tight">
            Données citoyennes indicatives. Contactez toujours l&apos;officine avant de vous déplacer.
          </p>
        </div>
      </div>

      {/* Recent reports list */}
      {reports.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
            Derniers signalements d&apos;officines (validés &lt; 48h) :
          </span>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {reports.slice(0, 5).map((r) => {
              const pharm = pharmacies.find((p) => p.id === r.pharmacyId);
              return (
                <div
                  key={r.id}
                  className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Building className="h-4 w-4 text-slate-400" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {pharm ? `${pharm.name} (${pharm.governorate})` : "Pharmacie"}
                      </span>
                      {r.isPharmacistVerified && (
                        <span className="text-[10px] font-bold text-emerald-700 inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          Officine vérifiée (CNOP #{r.pharmacistLicenceNumber || "Agréé"})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px] font-mono">
                      {new Date(r.createdAt).toLocaleDateString("fr-TN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {r.status === "available" ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        Disponible
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px]">
                        En rupture
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 h-9 w-9 rounded-full bg-slate-900 text-white font-black text-sm flex items-center justify-center hover:bg-slate-800 shadow-md z-10"
            >
              ✕
            </button>
            <ReportFormModal
              locale={locale}
              defaultMedicineId={medicineId}
              onSuccess={() => {
                // Refresh reports
                fetch(`/api/reports?medicineId=${medicineId}&pharmacyId=${pharmacies[0]?.id || ""}`)
                  .catch(() => {});
                setTimeout(() => setIsModalOpen(false), 2000);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
