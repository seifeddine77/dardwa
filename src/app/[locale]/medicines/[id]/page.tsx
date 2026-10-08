import React from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { SEED_MEDICINES } from "@/lib/data/mock-dataset";
import {
  findCheaperEquivalents,
  formatTndPrice,
} from "@/features/medicines/equivalence";
import { DisclaimerNotice } from "@/components/medicine/DisclaimerNotice";
import { EquivalentCard } from "@/components/medicine/EquivalentCard";
import { JsonLdDrug } from "@/components/medicine/JsonLdDrug";
import {
  Pill,
  CheckCircle,
  XCircle,
  Coins,
  Building2,
  Calendar,
  Layers,
  MapPin,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface MedicineDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateStaticParams() {
  const params: Array<{ locale: string; id: string }> = [];
  const locales = ["fr", "ar"];

  for (const locale of locales) {
    for (const med of SEED_MEDICINES) {
      params.push({ locale, id: med.id });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: MedicineDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const medicine = SEED_MEDICINES.find((m) => m.id === id);

  if (!medicine) {
    return { title: "Médicament introuvable" };
  }

  const dciNames = medicine.ingredients.map((i) => i.name).join(" + ");
  const priceFormatted = formatTndPrice(medicine.publicPriceTnd, locale);

  const title = `${medicine.brandName} (${medicine.dosage}) - Prix réglementé ${priceFormatted} & Génériques`;
  const description = `Fiche officielle ${medicine.brandName} en Tunisie. DCI: ${dciNames}, Forme: ${medicine.form}. Prix public: ${priceFormatted}. Découvrez les équivalents génériques et le remboursement CNAM.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/medicines/${id}`,
      languages: {
        fr: `/fr/medicines/${id}`,
        ar: `/ar/medicines/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function MedicineDetailPage({
  params,
}: MedicineDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const medicine = SEED_MEDICINES.find((m) => m.id === id);
  if (!medicine) {
    notFound();
  }

  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  // Compute cheaper equivalents
  const cheaperEquivalents = findCheaperEquivalents(medicine, SEED_MEDICINES);
  const dciNames = medicine.ingredients
    .map((i) => (locale === "ar" && i.nameAr ? i.nameAr : i.name))
    .join(" + ");

  return (
    <>
      <JsonLdDrug medicine={medicine} locale={locale} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/medicines"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700 transition"
          >
            <ArrowIcon className="h-4 w-4" />
            <span>
              {locale === "ar" ? "العودة إلى قائمة الأدوية" : "Retour au catalogue"}
            </span>
          </Link>
        </div>

        {/* Main Medicine Card Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold">
                  Code: {medicine.code}
                </span>
                {medicine.isGeneric ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    {locale === "ar" ? "دواء جنيس (Générique)" : "Générique"}
                  </span>
                ) : (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                    {locale === "ar" ? "دواء أصلي (Princeps)" : "Princeps (Original)"}
                  </span>
                )}
                {medicine.cnamCovered ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 inline-flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {locale === "ar" ? "مسترجع من الكنام" : "Pris en charge CNAM"}
                  </span>
                ) : (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-500 inline-flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5" />
                    {locale === "ar" ? "غير مسترجع من الكنام" : "Non remboursé CNAM"}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {medicine.brandName}
              </h1>
              {medicine.brandNameAr && (
                <p className="text-xl font-bold font-arabic text-emerald-800">
                  {medicine.brandNameAr}
                </p>
              )}

              <p className="text-sm font-semibold text-slate-600 pt-1">
                <span className="text-slate-400">DCI (Principe actif) :</span>{" "}
                <span className="text-emerald-700 underline decoration-emerald-300">
                  {dciNames}
                </span>
              </p>
            </div>

            {/* Official Regulated Price Box */}
            <div className="bg-emerald-50/70 border-2 border-emerald-500/20 rounded-2xl p-5 min-w-[240px] text-center md:text-end shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                {locale === "ar" ? "السعر العمومي الموحد" : "Prix Public Réglementé"}
              </span>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {formatTndPrice(medicine.publicPriceTnd, locale)}
              </div>

              {medicine.cnamCovered && medicine.cnamReferenceTariff && (
                <div className="mt-2 pt-2 border-t border-emerald-200/60 text-xs text-slate-600">
                  <span className="block text-slate-500">Tarif de référence CNAM :</span>
                  <span className="font-extrabold text-blue-800">
                    {formatTndPrice(medicine.cnamReferenceTariff, locale)}
                  </span>
                </div>
              )}

              <p className="text-[10px] text-slate-400 mt-2">
                Prix identique et fixé par l&apos;État dans toute la Tunisie
              </p>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Dosage</span>
              <p className="font-bold text-slate-900 text-sm">{medicine.dosage}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Forme</span>
              <p className="font-bold text-slate-900 text-sm">{medicine.form}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Présentation</span>
              <p className="font-bold text-slate-900 text-sm">
                {medicine.presentation || "Non spécifié"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Laboratoire</span>
              <p className="font-bold text-slate-900 text-sm">
                {medicine.laboratoryName || "Non spécifié"}
              </p>
            </div>
          </div>
        </div>

        {/* Mandatory Regulatory Medical Disclaimer */}
        <DisclaimerNotice />

        {/* Generic Equivalents Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Coins className="h-6 w-6 text-emerald-600" />
                <span>
                  {locale === "ar"
                    ? "البدائل الجنيسة المتاحة والأقل ثمناً"
                    : "Alternatives génériques plus économiques"}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {locale === "ar"
                  ? "نفس المادة الفعالة ونفس الجرعة والشكل الدوائي — مرتبة حسب السعر الأقل"
                  : "Même molécule active (DCI), même dosage et forme équivalente — classés par prix croissant"}
              </p>
            </div>
          </div>

          {cheaperEquivalents.length > 0 ? (
            <div className="space-y-3">
              {cheaperEquivalents.map((eq) => (
                <EquivalentCard key={eq.id} equivalent={eq} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700">
                {medicine.isGeneric
                  ? "Ce médicament est déjà parmi les options les plus économiques répertoriées pour ce dosage."
                  : "Aucun équivalent générique moins cher n'est actuellement répertorié pour ce dosage exact."}
              </p>
              <p className="text-xs text-slate-400">
                Demandez toujours conseil à votre pharmacien pour explorer d&apos;éventuelles alternatives adaptées.
              </p>
            </div>
          )}
        </section>

        {/* Nearby Pharmacy Search Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-start">
            <h3 className="text-lg font-extrabold flex items-center justify-center sm:justify-start gap-2">
              <MapPin className="h-5 w-5" />
              <span>Où trouver ce médicament ?</span>
            </h3>
            <p className="text-xs text-emerald-100 max-w-xl">
              Consultez les pharmacies de garde ouvertes aujourd&apos;hui ou recherchez une pharmacie proche de chez vous.
            </p>
          </div>

          <Link
            href="/pharmacies/de-garde"
            className="px-5 py-3 rounded-xl bg-white text-emerald-800 font-extrabold text-xs hover:bg-emerald-50 transition shadow-sm shrink-0"
          >
            Voir les pharmacies de garde
          </Link>
        </div>
      </div>
    </>
  );
}
