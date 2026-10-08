import React from "react";
import { Link } from "@/i18n/routing";
import { GenericEquivalent } from "@/types/domain.types";
import { formatTndPrice } from "@/features/medicines/equivalence";
import { Coins, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface EquivalentCardProps {
  equivalent: GenericEquivalent;
  locale: string;
}

export const EquivalentCard: React.FC<EquivalentCardProps> = ({
  equivalent,
  locale,
}) => {
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-emerald-50/50 border-2 border-emerald-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left info */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-extrabold text-slate-900">
            {equivalent.brandName}
          </span>
          {equivalent.brandNameAr && (
            <span className="font-arabic text-sm text-slate-600 font-bold">
              ({equivalent.brandNameAr})
            </span>
          )}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {locale === "ar" ? "بديل جنيس" : "Générique équivalent"}
          </span>
          {equivalent.cnamCovered && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 inline-flex items-center gap-1">
              <CheckCircle className="h-2.5 w-2.5" />
              CNAM
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600">
          {equivalent.dosage} • {equivalent.form}
          {equivalent.laboratoryName && ` • Laboratoire ${equivalent.laboratoryName}`}
        </p>

        {/* Savings Highlight */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs">
          <Coins className="h-3.5 w-3.5" />
          <span>
            {locale === "ar"
              ? `توفير: ${formatTndPrice(equivalent.priceDifferenceTnd, locale)} (${equivalent.percentageSavings}%)`
              : `Économie : ${formatTndPrice(equivalent.priceDifferenceTnd, locale)} (${equivalent.percentageSavings}%)`}
          </span>
        </div>
      </div>

      {/* Right Price & Link */}
      <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-emerald-200">
        <div className="text-start md:text-end">
          <span className="text-[10px] text-slate-500 block uppercase font-bold">
            {locale === "ar" ? "السعر الموحد" : "Prix réglementé"}
          </span>
          <span className="text-lg font-black text-emerald-800">
            {formatTndPrice(equivalent.publicPriceTnd, locale)}
          </span>
        </div>

        <Link
          href={`/medicines/${equivalent.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-emerald-400 hover:bg-emerald-600 hover:text-white text-emerald-800 font-bold text-xs transition shadow-xs shrink-0"
        >
          <span>{locale === "ar" ? "عرض البديل" : "Voir ce générique"}</span>
          <ArrowIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};
