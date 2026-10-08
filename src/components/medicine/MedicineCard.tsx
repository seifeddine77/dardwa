import React from "react";
import { Link } from "@/i18n/routing";
import { Medicine } from "@/types/domain.types";
import { formatTndPrice } from "@/features/medicines/equivalence";
import { Pill, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface MedicineCardProps {
  medicine: Medicine;
  locale: string;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  locale,
}) => {
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const dciNames = medicine.ingredients
    .map((i) => (locale === "ar" && i.nameAr ? i.nameAr : i.name))
    .join(" + ");

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {medicine.isGeneric ? (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {locale === "ar" ? "دواء جنيس" : "Générique"}
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {locale === "ar" ? "دواء أصلي" : "Princeps"}
              </span>
            )}
            {medicine.cnamCovered && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 inline-flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                CNAM
              </span>
            )}
          </div>
          <span className="text-xs font-mono text-slate-400">
            {medicine.code}
          </span>
        </div>

        {/* Brand & DCI */}
        <div className="mb-3">
          <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition">
            {medicine.brandName}
          </h3>
          {medicine.brandNameAr && (
            <p className="text-sm font-semibold font-arabic text-slate-500">
              {medicine.brandNameAr}
            </p>
          )}
          <p className="text-xs text-emerald-700 font-medium mt-1">
            <span className="font-semibold text-slate-500">DCI:</span> {dciNames}
          </p>
        </div>

        {/* Specs */}
        <div className="text-xs text-slate-600 space-y-1 mb-4 border-t border-slate-100 pt-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Dosage:</span>
            <span className="font-semibold">{medicine.dosage}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Forme:</span>
            <span className="font-semibold">{medicine.form}</span>
          </div>
          {medicine.laboratoryName && (
            <div className="flex justify-between">
              <span className="text-slate-400">Laboratoire:</span>
              <span className="font-semibold truncate max-w-[150px]">
                {medicine.laboratoryName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Price & CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase text-slate-400 block font-bold">
            Prix public
          </span>
          <span className="text-lg font-black text-slate-900">
            {formatTndPrice(medicine.publicPriceTnd, locale)}
          </span>
        </div>

        <Link
          href={`/medicines/${medicine.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition"
        >
          <span>{locale === "ar" ? "التفاصيل والبدائل" : "Fiche & Équivalents"}</span>
          <ArrowIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};
