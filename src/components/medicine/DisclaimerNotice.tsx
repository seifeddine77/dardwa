"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

interface DisclaimerNoticeProps {
  className?: string;
  compact?: boolean;
}

/**
 * Mandatory Tunisian Medical Regulation Disclaimer Component
 * MUST be displayed wherever medicine details, alternatives, or generic substitutions appear.
 */
export const DisclaimerNotice: React.FC<DisclaimerNoticeProps> = ({
  className = "",
  compact = false,
}) => {
  const t = useTranslations("common");

  if (compact) {
    return (
      <div
        role="alert"
        className={`flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-900 ${className}`}
      >
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
        <span className="font-medium">{t("mandatoryDisclaimer")}</span>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={`rounded-xl bg-amber-50/90 border border-amber-200/80 p-4 shadow-sm ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-amber-100 p-2 text-amber-700 shrink-0">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-950">
            Avertissement réglementaire obligatoire / تنبيه طبي وإداري
          </h4>
          <p className="text-sm font-semibold text-amber-900 leading-relaxed">
            {t("mandatoryDisclaimer")}
          </p>
          <p className="text-xs text-amber-800/80 leading-normal">
            {t("publicInterestNotice")}
          </p>
        </div>
      </div>
    </div>
  );
};
