"use client";

import React, { useState, useMemo } from "react";
import { DutySchedule } from "@/types/domain.types";
import { TUNISIAN_GOVERNORATES } from "@/features/pharmacies/tunisian-territory";
import { PharmacyCard } from "./PharmacyCard";
import { HeartPulse, Calendar, Building2, AlertCircle, Phone } from "lucide-react";

interface DutyPharmaciesViewProps {
  initialSchedules: DutySchedule[];
  locale: string;
}

export const DutyPharmaciesView: React.FC<DutyPharmaciesViewProps> = ({
  initialSchedules,
  locale,
}) => {
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<"today" | "tomorrow">("today");

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const filteredDuties = useMemo(() => {
    return initialSchedules.filter((schedule) => {
      // Filter governorate
      if (
        selectedGovernorate !== "all" &&
        schedule.pharmacy &&
        schedule.pharmacy.governorate.toLowerCase() !==
          selectedGovernorate.toLowerCase()
      ) {
        return false;
      }
      return true;
    });
  }, [initialSchedules, selectedGovernorate]);

  return (
    <div className="space-y-6">
      {/* Quick Emergency Notice */}
      <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 space-y-1">
          <p className="font-bold">
            {locale === "ar"
              ? "ملاحظة هامة لحالات الاستعجال"
              : "Consigne d'urgence nocturne"}
          </p>
          <p className="leading-relaxed">
            {locale === "ar"
              ? "يُنصح بالاتصال هاتفياً بالصيدلية قبل التنقل للتأكد من توفر الدواء المطلوب وتواجد الصيدلي المناوب."
              : "Il est fortement recommandé d'appeler l'officine de garde par téléphone avant de vous déplacer afin de confirmer la disponibilité du médicament et la présence du pharmacien."}
          </p>
        </div>
      </div>

      {/* Date & Governorate Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setDateFilter("today")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              dateFilter === "today"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {locale === "ar" ? "اليوم" : "Aujourd'hui"}
          </button>
          <button
            type="button"
            onClick={() => setDateFilter("tomorrow")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              dateFilter === "tomorrow"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {locale === "ar" ? "غداً" : "Demain"}
          </button>
        </div>

        {/* Governorate Select */}
        <div className="flex items-center gap-2 max-w-xs w-full">
          <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={selectedGovernorate}
            onChange={(e) => setSelectedGovernorate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">
              {locale === "ar" ? "كافة الولايات" : "Tous les gouvernorats"}
            </option>
            {TUNISIAN_GOVERNORATES.map((gov) => (
              <option key={gov.code} value={gov.nameFr}>
                {locale === "ar" ? gov.nameAr : gov.nameFr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Duties List */}
      {filteredDuties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDuties.map((duty) => {
            if (!duty.pharmacy) return null;
            return (
              <PharmacyCard
                key={duty.id}
                pharmacy={duty.pharmacy}
                locale={locale}
                dutyType={duty.dutyType}
                dutyNotes={duty.notes}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <HeartPulse className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">
            Aucune garde enregistrée pour ce filtre actuellement.
          </p>
          <p className="text-xs text-slate-400">
            Sélectionnez un autre gouvernorat ou consultez l&apos;annuaire complet des pharmacies.
          </p>
        </div>
      )}
    </div>
  );
};
