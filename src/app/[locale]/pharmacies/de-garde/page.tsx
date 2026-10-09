import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { getAllDutySchedules } from "@/lib/data/repository";
import { DutyPharmaciesView } from "@/components/pharmacy/DutyPharmaciesView";
import { HeartPulse, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pharmacies de Garde en Tunisie - Nuit & Dimanche",
  description:
    "Consultez en direct les pharmacies de garde ouvertes cette nuit et les week-ends par gouvernorat en Tunisie. Numéros de téléphone directs et itinéraires.",
};

interface DutyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DutyPharmaciesPage({ params }: DutyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const schedules = await getAllDutySchedules();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Emergency Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <HeartPulse className="h-4 w-4 animate-pulse text-emerald-600" />
          <span>{locale === "ar" ? "خدمة الاستمرار الصيدلي" : "Service de Garde Officiel"}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {locale === "ar"
            ? "صيدليات الاستمرار المفتوحة في تونس"
            : "Pharmacies de Garde en Tunisie"}
        </h1>

        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          {locale === "ar"
            ? "تصفح صيدليات الاستمرار الليلي والأيام والأعياد الرسمية، واتصل فوراً للتأكد من توفر الدواء المطلوب."
            : "Accédez instantanément à la liste des officines assurant la garde de nuit (20h-08h) et de jour (dimanche et jours fériés)."}
        </p>
      </div>

      {/* Main Duty View Component */}
      <DutyPharmaciesView
        initialSchedules={schedules}
        locale={locale}
      />
    </div>
  );
}
