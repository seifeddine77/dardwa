import React from "react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { DisclaimerNotice } from "@/components/medicine/DisclaimerNotice";
import { MedicineAutocomplete } from "@/components/search/MedicineAutocomplete";
import {
  HeartPulse,
  Coins,
  ShieldCheck,
  Users,
  MapPin,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent locale={locale} />;
}

function HomeContent({ locale }: { locale: string }) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 border-b border-emerald-100/60 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tunisie • تونس — Données publiques réglementées</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {t("heroTitle")}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>

          {/* Instant Typo-Tolerant Autocomplete Search */}
          <div className="pt-2">
            <MedicineAutocomplete autoFocus />
            <p className="text-xs text-slate-500 mt-2.5 text-center">
              Recherchez par nom commercial (ex: <span className="font-semibold text-slate-700">Doliprane</span>) ou DCI (ex: <span className="font-semibold text-slate-700">Paracétamol</span>, <span className="font-semibold text-slate-700">أموكسيسيلين</span>)
            </p>
          </div>

          {/* Quick Duty Pharmacy Banner */}
          <div className="pt-4">
            <Link
              href="/pharmacies/de-garde"
              className="inline-flex items-center gap-3 bg-white border border-emerald-200 hover:border-emerald-400 shadow-sm hover:shadow-md px-5 py-3 rounded-xl text-slate-800 transition group"
            >
              <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <HeartPulse className="h-5 w-5 animate-pulse" />
              </div>
              <div className="text-start">
                <p className="text-xs text-slate-500">{t("quickDuty")}</p>
                <p className="text-sm font-bold text-emerald-800 group-hover:text-emerald-900">
                  {t("quickDutyCta")}
                </p>
              </div>
              <ArrowIcon className="h-4 w-4 text-emerald-600 ms-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mandatory Regulatory Medical Disclaimer */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <DisclaimerNotice />
      </section>

      {/* Feature Value Propositions */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t("featuresTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: Generics & Savings */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Coins className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {t("featureGenericsTitle")}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t("featureGenericsDesc")}
            </p>
          </div>

          {/* Feature 2: Duty Pharmacies */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <HeartPulse className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {t("featureDutyTitle")}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t("featureDutyDesc")}
            </p>
          </div>

          {/* Feature 3: Community Availability */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition">
            <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {t("featureReportsTitle")}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t("featureReportsDesc")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
