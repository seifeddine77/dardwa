"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Pharmacy } from "@/types/domain.types";
import { TUNISIAN_GOVERNORATES } from "@/features/pharmacies/tunisian-territory";
import {
  calculateHaversineDistanceKm,
} from "@/features/pharmacies/geo-utils";
import { PharmacyCard } from "./PharmacyCard";
import {
  MapPin,
  List,
  Map as MapIcon,
  Navigation,
  ShieldCheck,
  Building,
} from "lucide-react";

// Dynamically import InteractiveMap without SSR to keep initial page bundle ultra-light
const DynamicMap = dynamic(
  () =>
    import("@/components/pharmacy/InteractiveMap").then(
      (mod) => mod.InteractiveMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm animate-pulse">
        Chargement de la carte...
      </div>
    ),
  }
);

interface PharmacyDirectoryViewProps {
  initialPharmacies: Pharmacy[];
  locale: string;
}

export const PharmacyDirectoryView: React.FC<PharmacyDirectoryViewProps> = ({
  initialPharmacies,
  locale,
}) => {
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Request browser geolocation (kept strictly in memory)
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ];
        setUserLocation(coords);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        setGeoError(
          "Impossible d'accéder à votre position (autorisation refusée)."
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Filter and compute distances
  const filteredPharmacies = useMemo(() => {
    let result = initialPharmacies;

    if (selectedGovernorate !== "all") {
      result = result.filter(
        (p) =>
          p.governorate.toLowerCase() === selectedGovernorate.toLowerCase()
      );
    }

    if (userLocation) {
      const [uLng, uLat] = userLocation;
      return result
        .map((p) => ({
          ...p,
          distanceKm: calculateHaversineDistanceKm(
            uLat,
            uLng,
            p.latitude,
            p.longitude
          ),
        }))
        .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    }

    return result.map((p) => ({ ...p, distanceKm: undefined }));
  }, [initialPharmacies, selectedGovernorate, userLocation]);

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Governorate Filter */}
        <div className="flex items-center gap-2 flex-grow max-w-md">
          <Building className="h-5 w-5 text-slate-400 shrink-0" />
          <select
            value={selectedGovernorate}
            onChange={(e) => setSelectedGovernorate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">
              {locale === "ar" ? "كل الولايات (تونس)" : "Tous les gouvernorats"}
            </option>
            {TUNISIAN_GOVERNORATES.map((gov) => (
              <option key={gov.code} value={gov.nameFr}>
                {locale === "ar" ? gov.nameAr : gov.nameFr}
              </option>
            ))}
          </select>
        </div>

        {/* Geolocation Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleRequestLocation}
            disabled={isLocating}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              userLocation
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800"
            }`}
          >
            <Navigation className={`h-4 w-4 ${isLocating ? "animate-spin" : ""}`} />
            <span>
              {isLocating
                ? "Localisation..."
                : userLocation
                ? "Localisé autour de moi"
                : "Autour de moi (GPS)"}
            </span>
          </button>

          {/* List vs Map Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Vue liste"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Liste</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === "map"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Vue carte"
            >
              <MapIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Carte</span>
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>
          Votre géolocalisation est traitée temporairement sur votre appareil et n&apos;est jamais enregistrée sur nos serveurs (Loi 2004-63).
        </span>
      </div>

      {geoError && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          {geoError}
        </div>
      )}

      {/* Results View */}
      {viewMode === "map" ? (
        <div className="space-y-4">
          <DynamicMap
            pharmacies={filteredPharmacies}
            userLocation={userLocation}
            locale={locale}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {filteredPharmacies.length} officine(s) répertoriée(s)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPharmacies.map((pharmacy) => (
              <PharmacyCard
                key={pharmacy.id}
                pharmacy={pharmacy}
                locale={locale}
                distanceKm={pharmacy.distanceKm}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
