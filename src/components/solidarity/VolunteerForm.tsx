"use client";

import React, { useState } from "react";
import { TUNISIAN_GOVERNORATES } from "@/features/pharmacies/tunisian-territory";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

interface VolunteerFormProps {
  locale: string;
}

export const VolunteerForm: React.FC<VolunteerFormProps> = ({ locale }) => {
  const [fullName, setFullName] = useState("");
  const [governorate, setGovernorate] = useState(TUNISIAN_GOVERNORATES[0].nameFr);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("reporting_verification");
  const [motivation, setMotivation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          governorate,
          email,
          role,
          motivation,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error ||
            (data.details?.motivation?._errors?.[0]
              ? data.details.motivation._errors[0]
              : "Erreur de validation.")
        );
      }

      setFeedback({ type: "success", text: data.message });
      setFullName("");
      setEmail("");
      setMotivation("");
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Erreur lors de l'envoi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {feedback && (
        <div
          className={`sm:col-span-2 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
              : "bg-rose-50 border border-rose-200 text-rose-900"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700">Nom & Prénom</label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Yasmine Mansour"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700">Gouvernorat</label>
        <select
          value={governorate}
          onChange={(e) => setGovernorate(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {TUNISIAN_GOVERNORATES.map((gov) => (
            <option key={gov.code} value={gov.nameFr}>
              {gov.nameFr}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700">Email de contact</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="yasmine@email.tn"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700">Rôle souhaité</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="reporting_verification">Vérification des disponibilités locales</option>
          <option value="translation">Traduction et localisation arabe</option>
          <option value="data_cleaning">Nettoyage & saisie des données PCT</option>
          <option value="user_support">Assistance usagers</option>
        </select>
      </div>

      <div className="sm:col-span-2 space-y-1">
        <label className="text-xs font-bold text-slate-700">Motivation</label>
        <textarea
          rows={3}
          required
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          placeholder="Décrivez brièvement votre intérêt et disponibilité (au moins 10 caractères)..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : null}
          <span>
            {locale === "ar"
              ? "إرسال طلب التطوع"
              : "Soumettre ma candidature bénévole"}
          </span>
        </button>
      </div>
    </form>
  );
};
