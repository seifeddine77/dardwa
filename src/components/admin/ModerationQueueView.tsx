"use client";

import React, { useState } from "react";
import { AvailabilityReport, Medicine, Pharmacy, ModerationStatus } from "@/types/domain.types";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";

interface ModerationQueueViewProps {
  initialReports: AvailabilityReport[];
  medicines: Medicine[];
  pharmacies: Pharmacy[];
  locale: string;
}

export const ModerationQueueView: React.FC<ModerationQueueViewProps> = ({
  initialReports,
  medicines,
  pharmacies,
  locale,
}) => {
  const [reports, setReports] = useState<AvailabilityReport[]>(initialReports);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: ModerationStatus) => {
    setLoadingId(id);
    setActionFeedback(null);

    try {
      const res = await fetch("/api/admin/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur de mise à jour.");
      }

      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, moderationStatus: status } : r))
      );
      setActionFeedback(`Signalement mis à jour : ${status}`);
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (err: any) {
      setActionFeedback(err.message || "Erreur lors de la modération.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {actionFeedback && (
        <div className="p-3 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-between">
          <span>{actionFeedback}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="px-5 py-3.5 text-start">Médicament</th>
                <th className="px-5 py-3.5 text-start">Pharmacie</th>
                <th className="px-5 py-3.5 text-start">Statut</th>
                <th className="px-5 py-3.5 text-start">Date signalement</th>
                <th className="px-5 py-3.5 text-start">Expiration (48h)</th>
                <th className="px-5 py-3.5 text-start">Modération</th>
                <th className="px-5 py-3.5 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400 font-semibold">
                    Aucun signalement dans la file actuellement.
                  </td>
                </tr>
              ) : (
                reports.map((report) => {
                  const med = medicines.find((m) => m.id === report.medicineId);
                  const pharm = pharmacies.find((p) => p.id === report.pharmacyId);
                  const isProcessing = loadingId === report.id;

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
                      <td className="px-5 py-4 text-slate-500 font-mono">
                        {new Date(report.createdAt).toLocaleString("fr-TN")}
                      </td>
                      <td className="px-5 py-4 text-slate-500 font-mono">
                        {new Date(report.expiresAt).toLocaleString("fr-TN")}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold ${
                            report.moderationStatus === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : report.moderationStatus === "rejected"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {report.moderationStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-end space-x-2">
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin text-slate-500 inline-block" />
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(report.id, "approved")}
                              disabled={report.moderationStatus === "approved"}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-40 text-emerald-800 font-bold rounded-lg border border-emerald-200 transition"
                            >
                              Approuver
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(report.id, "rejected")}
                              disabled={report.moderationStatus === "rejected"}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 disabled:opacity-40 text-rose-800 font-bold rounded-lg border border-rose-200 transition"
                            >
                              Rejeter
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
