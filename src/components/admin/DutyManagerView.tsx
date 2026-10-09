"use client";

import React, { useState } from "react";
import { DutySchedule, DutyType } from "@/types/domain.types";
import { SEED_PHARMACIES, SEED_DUTY_SCHEDULES } from "@/lib/data/mock-dataset";
import {
  HeartPulse,
  Plus,
  Trash2,
  Calendar,
  Building,
  CheckCircle2,
} from "lucide-react";

import { Pharmacy } from "@/types/domain.types";

interface DutyManagerViewProps {
  locale: string;
  initialSchedules?: DutySchedule[];
  initialPharmacies?: Pharmacy[];
}

export const DutyManagerView: React.FC<DutyManagerViewProps> = ({
  locale,
  initialSchedules = SEED_DUTY_SCHEDULES,
  initialPharmacies = SEED_PHARMACIES,
}) => {
  const [schedules, setSchedules] = useState<DutySchedule[]>(initialSchedules);
  const [pharmacies] = useState<Pharmacy[]>(initialPharmacies);
  const [pharmacyId, setPharmacyId] = useState<string>(
    initialPharmacies[0]?.id || ""
  );
  const [dutyDate, setDutyDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [dutyType, setDutyType] = useState<DutyType>("night");
  const [notes, setNotes] = useState<string>("Garde de nuit 20h -> 08h");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleAddDuty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pharmacyId) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/duty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pharmacyId,
          dutyDate,
          dutyType,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'ajout de la garde.");
      }

      setSchedules([data.schedule, ...schedules]);
      setFeedback("Nouvelle garde programmée avec succès et persistée en base !");
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback(err.message || "Erreur réseau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/duty?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Échec de suppression.");
      }
      setSchedules(schedules.filter((s) => s.id !== id));
      setFeedback("Garde retirée du planning.");
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback(err.message || "Erreur lors de la suppression.");
    }
  };

  return (
    <div className="space-y-8">
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Add New Duty Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Plus className="h-5 w-5 text-emerald-600" />
          <span>Planifier une nouvelle garde</span>
        </h3>

        <form
          onSubmit={handleAddDuty}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
        >
          {/* Pharmacy select */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Pharmacie</label>
            <select
              value={pharmacyId}
              onChange={(e) => setPharmacyId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
            >
              {pharmacies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.governorate})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Date</label>
            <input
              type="date"
              value={dutyDate}
              onChange={(e) => setDutyDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
            />
          </div>

          {/* Type */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Type de garde</label>
            <select
              value={dutyType}
              onChange={(e) => setDutyType(e.target.value as DutyType)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
            >
              <option value="night">Garde de nuit (20h - 08h)</option>
              <option value="day">Garde de jour / Dimanche</option>
              <option value="continuous_24h">Ouvert 24h/24</option>
            </select>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-xs"
            >
              {isSubmitting ? "Enregistrement..." : "Ajouter au planning"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Schedules Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-900">
            Plannings de Garde Actifs ({schedules.length})
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3 text-start">Pharmacie</th>
                <th className="px-5 py-3 text-start">Gouvernorat</th>
                <th className="px-5 py-3 text-start">Date</th>
                <th className="px-5 py-3 text-start">Type de garde</th>
                <th className="px-5 py-3 text-start">Consigne</th>
                <th className="px-5 py-3 text-end">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {schedule.pharmacy?.name}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {schedule.pharmacy?.governorate}
                  </td>
                  <td className="px-5 py-3.5 font-mono">
                    {schedule.dutyDate}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800">
                      {schedule.dutyType === "night"
                        ? "Nuit"
                        : schedule.dutyType === "continuous_24h"
                        ? "24h/24"
                        : "Jour"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {schedule.notes || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-end">
                    <button
                      type="button"
                      onClick={() => handleDelete(schedule.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Supprimer la garde"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
