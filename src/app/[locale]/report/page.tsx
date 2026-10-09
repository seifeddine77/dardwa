import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { ReportFormModal } from "@/components/report/ReportFormModal";
import { DisclaimerNotice } from "@/components/medicine/DisclaimerNotice";
import { HeartHandshake, ShieldCheck, Clock, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Signaler la Disponibilité d'un Médicament en Pharmacie",
  description:
    "Aidez les citoyens tunisiens en signalant en temps réel si un médicament est disponible ou en rupture dans une pharmacie. Système communautaire avec expiration après 48h.",
};

interface ReportPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Intro Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <HeartHandshake className="h-4 w-4 text-emerald-600" />
          <span>
            {locale === "ar"
              ? "مبادرة تضامنية ومواطنية"
              : "Solidarité Citoyenne & Santé Publique"}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {locale === "ar"
            ? "شارك في متابعة توفر الأدوية"
            : "Participez au suivi de disponibilité des médicaments"}
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          {locale === "ar"
            ? "وجدت دواءك في الصيدلية أو لاحظت نفاده؟ أخبر المجتمع بضغطة زر واحدة لتسهيل رحلة العلاج على غيرك."
            : "Vous sortez d'une officine ? Indiquez en 30 secondes si un médicament recherché est disponible ou en rupture de stock."}
        </p>
      </div>

      {/* Rules & Guarantee Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-0.5">Fraîcheur 48h</h4>
            <p className="text-slate-500">
              Les signalements expirent automatiquement après 48 heures.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-800 shrink-0">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-0.5">Loi 2004-63</h4>
            <p className="text-slate-500">
              Protection totale : aucune donnée personnelle n&apos;est transmise ou vendue.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-800 shrink-0">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-0.5">Communauté</h4>
            <p className="text-slate-500">
              Plus de 90% des signalements sont corroborés par plusieurs usagers.
            </p>
          </div>
        </div>
      </div>

      {/* Submission Form Modal/Card */}
      <ReportFormModal locale={locale} />

      {/* Medical Disclaimer */}
      <div className="max-w-2xl mx-auto">
        <DisclaimerNotice compact />
      </div>
    </div>
  );
}
