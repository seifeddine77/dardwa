"use client";

import React, { useState } from "react";
import { SEED_MEDICINES, SEED_PHARMACIES } from "@/lib/data/mock-dataset";
import {
  Pill,
  Building,
  CheckCircle2,
  AlertOctagon,
  Loader2,
  Check,
  ShieldCheck,
} from "lucide-react";

import { Medicine, Pharmacy } from "@/types/domain.types";

interface ReportFormModalProps {
  locale: string;
  defaultMedicineId?: string;
  defaultPharmacyId?: string;
  medicines?: Medicine[];
  pharmacies?: Pharmacy[];
  onSuccess?: () => void;
}

export const ReportFormModal: React.FC<ReportFormModalProps> = ({
  locale,
  defaultMedicineId,
  defaultPharmacyId,
  medicines = SEED_MEDICINES,
  pharmacies = SEED_PHARMACIES,
  onSuccess,
}) => {
  const [medicineId, setMedicineId] = useState(
    defaultMedicineId || medicines[0]?.id || ""
  );
  const [pharmacyId, setPharmacyId] = useState(
    defaultPharmacyId || pharmacies[0]?.id || ""
  );
  const [status, setStatus] = useState<"available" | "out_of_stock">("available");
  const [email, setEmail] = useState("");
  const [websiteHoneypot, setWebsiteHoneypot] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicineId,
          pharmacyId,
          status,
          email: email.trim() || undefined,
          website: websiteHoneypot, // Honeypot
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      setMessage({
        type: "success",
        text:
          locale === "ar"
            ? "شكراً لمساهمتك! تم تسجيل الإبلاغ لمدة 48 ساعة بنجاح."
            : "Merci ! Votre signalement a été enregistré avec succès pour 48 heures.",
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Erreur de connexion. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg max-w-xl mx-auto">
      <div className="space-y-2 mb-6">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {locale === "ar"
            ? "إبلاغ عن توفر دواء في صيدلية"
            : "Signaler la disponibilité d'un médicament"}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {locale === "ar"
            ? "مشاركتك تساعد آلاف المرضى في العثور على أدويتهم وتجنب التنقل دون جدوى."
            : "Votre contribution solidaire aide les autres citoyens à savoir si ce traitement est en stock ou en rupture."}
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold mb-6 flex items-start gap-2.5 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-rose-50 text-rose-900 border border-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertOctagon className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Anti-Spam Honeypot Field (Invisible to human users, filled by spam bots) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website (laisser vide)</label>
          <input
            id="website"
            type="text"
            name="website"
            value={websiteHoneypot}
            onChange={(e) => setWebsiteHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Medicine Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Pill className="h-4 w-4 text-emerald-600" />
            <span>{locale === "ar" ? "الدواء المعني" : "Médicament"}</span>
          </label>
          <select
            value={medicineId}
            onChange={(e) => setMedicineId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {medicines.map((med) => (
              <option key={med.id} value={med.id}>
                {med.brandName} ({med.dosage} - {med.form})
              </option>
            ))}
          </select>
        </div>

        {/* Pharmacy Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Building className="h-4 w-4 text-emerald-600" />
            <span>{locale === "ar" ? "الصيدلية" : "Pharmacie"}</span>
          </label>
          <select
            value={pharmacyId}
            onChange={(e) => setPharmacyId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {pharmacies.map((pharm) => (
              <option key={pharm.id} value={pharm.id}>
                {pharm.name} - {pharm.delegation} ({pharm.governorate})
              </option>
            ))}
          </select>
        </div>

        {/* Status Radio */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            {locale === "ar" ? "حالة التوفر الحالية" : "État de disponibilité constaté"}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStatus("available")}
              className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition ${
                status === "available"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{locale === "ar" ? "متوفر بالمخزون" : "Disponible"}</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus("out_of_stock")}
              className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition ${
                status === "out_of_stock"
                  ? "border-rose-500 bg-rose-50 text-rose-900 shadow-xs"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <AlertOctagon className="h-4 w-4 text-rose-600" />
              <span>{locale === "ar" ? "غير متوفر / مفقود" : "En rupture"}</span>
            </button>
          </div>
        </div>

        {/* Optional Email for Notifications */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            {locale === "ar"
              ? "البريد الإلكتروني (اختياري للتحقق السريع)"
              : "Email (facultatif, lien magique pour authentification légère)"}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemple@domaine.tn"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Security & Privacy Notice */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            {locale === "ar"
              ? "ينتهي الإبلاغ آلياً بعد 48 ساعة لضمان موثوقية المعطيات."
              : "Ce signalement expirera automatiquement après 48h pour garantir la fraîcheur de l'information."}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          ) : (
            <span>
              {locale === "ar" ? "تأكيد وإرسال الإبلاغ" : "Envoyer le signalement"}
            </span>
          )}
        </button>
      </form>
    </div>
  );
};
