import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { AlertTriangle, ShieldAlert, HeartPulse } from "lucide-react";
import { DisclaimerNotice } from "@/components/medicine/DisclaimerNotice";

export const metadata: Metadata = {
  title: "Avertissement Médical Réglementaire - DarDwa (دار الدواء)",
  description:
    "Avertissement légal et décharge médicale : DarDwa ne dispense aucun conseil médical ni posologie.",
};

interface DisclaimerPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DisclaimerLegalPage({
  params,
}: DisclaimerPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span>Notice Réglementaire & Sanitaire</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Avertissement Médical Obligatoire
        </h1>
        <p className="text-sm text-slate-600">
          Ce que fait DarDwa, et ce qu&apos;elle ne fera jamais : limites de responsabilité et conseils de santé.
        </p>
      </div>

      <DisclaimerNotice />

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900">
            1. Rôle Strictement Informatif
          </h2>
          <p>
            Les données présentées sur DarDwa sont exclusivement fournies à des fins de consultation publique. <strong>En aucun cas les informations publiées ne constituent un avis médical, une prescription, un diagnostic ou une incitation à l&apos;automédication</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900">
            2. Règle d&apos;Or de Substitution
          </h2>
          <div className="p-4 bg-emerald-50 border-s-4 border-emerald-600 rounded-r-xl space-y-1 text-emerald-950">
            <p className="font-bold">
              « Demandez conseil à votre pharmacien ou médecin avant toute substitution. »
            </p>
            <p className="font-arabic font-bold text-sm">
              « استشر الصيدلي أو الطبيب قبل أي تعويض. »
            </p>
          </div>
          <p className="pt-2 text-xs text-slate-600">
            Certains médicaments bien qu&apos;ayant la même molécule active peuvent présenter des excipients à effet notoire (intolérance au lactose, sel, etc.) ou des cinétiques d&apos;absorption différentes. Seul votre professionnel de santé est habilité à valider la substitution.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900">
            3. Cas d&apos;Urgence Vitale
          </h2>
          <p>
            En cas d&apos;urgence médicale ou de détresse vitale, <strong>ne perdez pas de temps à consulter une application mobile</strong>. Contactez immédiatement les services de secours tunisiens :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs text-slate-500 block">SAMU Tunisie</span>
              <span className="text-xl font-black text-rose-700">190</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs text-slate-500 block">Protection Civile</span>
              <span className="text-xl font-black text-rose-700">198</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
