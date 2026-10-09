import React from "react";
import { Pharmacy } from "@/types/domain.types";
import {
  formatDistance,
  formatPhoneTelUri,
  getDirectionsUrl,
} from "@/features/pharmacies/geo-utils";
import {
  Phone,
  PhoneCall,
  MapPin,
  Navigation,
  HeartPulse,
  CheckCircle2,
} from "lucide-react";

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  locale: string;
  distanceKm?: number;
  dutyType?: "night" | "day" | "continuous_24h";
  dutyNotes?: string;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({
  pharmacy,
  locale,
  distanceKm,
  dutyType,
  dutyNotes,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
      {/* Top Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {dutyType === "continuous_24h" && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white animate-pulse">
                {locale === "ar" ? "مفتوحة 24/24" : "Ouvert 24h/24"}
              </span>
            )}
            {dutyType === "night" && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                <HeartPulse className="h-3 w-3 text-purple-600" />
                {locale === "ar" ? "استمرار ليلي" : "Garde de nuit"}
              </span>
            )}
            {pharmacy.isVerified && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                {locale === "ar" ? "صيدلية مؤكدة" : "Officine vérifiée"}
              </span>
            )}
          </div>

          {typeof distanceKm === "number" && (
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
              {formatDistance(distanceKm, locale)}
            </span>
          )}
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">
            {pharmacy.name}
          </h3>
          {pharmacy.nameAr && (
            <p className="text-sm font-semibold font-arabic text-slate-500">
              {pharmacy.nameAr}
            </p>
          )}
        </div>

        <div className="text-xs text-slate-600 space-y-1">
          <p className="flex items-start gap-1.5">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              {pharmacy.address}, {pharmacy.delegation} ({pharmacy.governorate})
            </span>
          </p>
          {dutyNotes && (
            <p className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md font-medium">
              ℹ️ {dutyNotes}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        {pharmacy.phone ? (
          <a
            href={formatPhoneTelUri(pharmacy.phone)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>{pharmacy.phone}</span>
          </a>
        ) : (
          <span className="text-xs text-slate-400">Sans téléphone</span>
        )}

        {pharmacy.phoneEmergency && (
          <a
            href={formatPhoneTelUri(pharmacy.phoneEmergency)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition"
            title="Numéro d'urgence"
          >
            <PhoneCall className="h-3.5 w-3.5 text-amber-600" />
            <span>Urgence</span>
          </a>
        )}

        <a
          href={getDirectionsUrl(pharmacy.latitude, pharmacy.longitude)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition ms-auto"
        >
          <Navigation className="h-3.5 w-3.5 text-slate-500" />
          <span>{locale === "ar" ? "الاتجاهات" : "Itinéraire"}</span>
        </a>
      </div>
    </div>
  );
};
