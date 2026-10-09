import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { Pill, HeartHandshake, ShieldCheck, Scale } from "lucide-react";
import { DisclaimerNotice } from "@/components/medicine/DisclaimerNotice";

export const metadata: Metadata = {
  title: "À Propos de DarDwa - دار الدواء | Plateforme Citoyenne",
  description:
    "Découvrez la mission d'intérêt public de DarDwa : faciliter l'accès aux médicaments, valoriser les génériques économiques et localiser les gardes en Tunisie.",
};

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <HeartHandshake className="h-4 w-4 text-emerald-600" />
          <span>{locale === "ar" ? "مشروع مواطني وتضامني" : "Projet d'Intérêt Public & Citoyen"}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          DarDwa <span className="text-emerald-700 font-arabic">دار الدواء</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {locale === "ar"
            ? "منصة تونسية حرة ومجانية تهدف إلى تمكين المواطن من إيجاد أدويته، مقارنة البدائل الجنيسة الموفرة، ومعرفة صيدليات الاستمرار المفتوحة في كامل تراب الجمهورية."
            : "Une initiative technologique indépendante et gratuite conçue pour simplifier le parcours de santé des citoyens tunisiens face aux pénuries et au pouvoir d'achat."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Scale className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {locale === "ar" ? "أسعار موحدة ومنظمة" : "Prix Réglementés par l'État"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {locale === "ar"
              ? "أسعار الأدوية في تونس محددة رسمياً من طرف وزارة التجارة والصحة، ولا تختلف من صيدلية إلى أخرى. تكمن القوة في اختيار البدائل الجنيسة المرخصة التي توفر نفس الفاعلية بثمن أقل."
              : "En Tunisie, les prix des médicaments sont strictement encadrés par la loi et identiques dans toutes les officines. DarDwa n'est pas un comparateur de prix entre pharmacies, mais un guide pour identifier les alternatives génériques officielles plus économiques."}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {locale === "ar" ? "مسؤولية طبية وأمان" : "Éthique & Neutralité"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {locale === "ar"
              ? "المنصة لا تقدم أي استشارة طبية أو وصفة علاجية. يُرجى دائماً استشارة الطبيب أو الصيدلي قبل استبدال أي دواء."
              : "DarDwa n'émet aucun avis médical, dosage ou prescription. L'application est un outil d'information publique neutre et transparent."}
          </p>
        </div>
      </div>

      <DisclaimerNotice />
    </div>
  );
}
