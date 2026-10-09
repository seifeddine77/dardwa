import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { getAllPharmacies } from "@/lib/data/repository";
import { PharmacyDirectoryView } from "@/components/pharmacy/PharmacyDirectoryView";
import { Link } from "@/i18n/routing";
import { HeartPulse, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Annuaire des Pharmacies en Tunisie - Coordonnées & Horaires",
  description:
    "Trouvez les pharmacies de jour et de nuit ouvertes en Tunisie, filtrez par gouvernorat et localisez l'officine la plus proche avec MapLibre et OpenStreetMap.",
};

interface PharmaciesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PharmaciesPage({ params }: PharmaciesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const pharmacies = await getAllPharmacies();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <MapPin className="h-4 w-4" />
            <span>{locale === "ar" ? "دليل الصيدليات" : "Cartographie & Annuaire"}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {locale === "ar"
              ? "دليل الصيدليات في تونس"
              : "Annuaire des Pharmacies en Tunisie"}
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            {locale === "ar"
              ? "ابحث عن الصيدليات في كافة الولايات والبلديات، وتعرف على أرقام الهواتف ومسارات الوصول."
              : "Consultez les coordonnées des officines réparties sur les 24 gouvernorats tunisiens, appelez directement et lancez votre itinéraire."}
          </p>
        </div>

        {/* Quick Duty Shortcut */}
        <Link
          href="/pharmacies/de-garde"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold text-xs transition shadow-xs shrink-0"
        >
          <HeartPulse className="h-4 w-4 text-emerald-600 animate-pulse" />
          <span>
            {locale === "ar"
              ? "صيدليات الاستمرار اليوم"
              : "Consulter les gardes d'aujourd'hui"}
          </span>
        </Link>
      </div>

      {/* Directory & Map View */}
      <PharmacyDirectoryView
        initialPharmacies={pharmacies}
        locale={locale}
      />
    </div>
  );
}
