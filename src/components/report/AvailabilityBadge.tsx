import React from "react";
import { CheckCircle2, AlertOctagon, HelpCircle } from "lucide-react";

interface AvailabilityBadgeProps {
  status: "available" | "out_of_stock" | "unknown";
  hoursAgo: number | null;
  count: number;
  locale: string;
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({
  status,
  hoursAgo,
  count,
  locale,
}) => {
  if (status === "available") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold shadow-xs">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>
          {locale === "ar"
            ? `متوفر • تم التأكيد منذ ${hoursAgo ?? 0} س من قِبل ${count} مواطن`
            : `Disponible • Signalé il y a ${hoursAgo ?? 0}h par ${count} citoyen(s)`}
        </span>
      </div>
    );
  }

  if (status === "out_of_stock") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 text-rose-900 border border-rose-300 text-xs font-bold shadow-xs">
        <AlertOctagon className="h-4 w-4 text-rose-600 shrink-0" />
        <span>
          {locale === "ar"
            ? `في حالة نفاد • تم الإبلاغ منذ ${hoursAgo ?? 0} س من قِبل ${count} مواطن`
            : `En rupture • Signalé il y a ${hoursAgo ?? 0}h par ${count} citoyen(s)`}
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium">
      <HelpCircle className="h-4 w-4 text-slate-400 shrink-0" />
      <span>
        {locale === "ar"
          ? "لا توجد بلاغات توفر حديثة خلال 48 ساعة"
          : "Aucun signalement récent (< 48h)"}
      </span>
    </div>
  );
};
