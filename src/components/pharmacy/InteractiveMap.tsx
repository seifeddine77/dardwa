"use client";

import React, { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Pharmacy } from "@/types/domain.types";
import { formatPhoneTelUri, getDirectionsUrl } from "@/features/pharmacies/geo-utils";

interface InteractiveMapProps {
  pharmacies: Pharmacy[];
  userLocation?: [number, number] | null; // [lng, lat]
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  locale?: string;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  pharmacies,
  userLocation,
  center = [10.1815, 36.8002], // Default Tunis center
  zoom = 12,
  locale = "fr",
  className = "h-[500px] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize MapLibre GL map with OpenStreetMap raster tiles
    const initialCenter = userLocation || center;
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: "osm-tiles",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: initialCenter,
      zoom: zoom,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    mapRef.current = map;

    // Add marker for user location if available
    if (userLocation) {
      const el = document.createElement("div");
      el.className = "user-location-marker";
      el.style.width = "18px";
      el.style.height = "18px";
      el.style.backgroundColor = "#2563eb";
      el.style.borderRadius = "50%";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 0 10px rgba(37,99,235,0.6)";

      new maplibregl.Marker({ element: el })
        .setLngLat(userLocation)
        .setPopup(
          new maplibregl.Popup({ offset: 15 }).setHTML(
            `<strong style="font-size:12px;">📍 ${locale === "ar" ? "موقعك الحالي" : "Votre position"}</strong>`
          )
        )
        .addTo(map);
    }

    // Add markers for pharmacies
    pharmacies.forEach((pharmacy) => {
      const popupHtml = `
        <div style="font-family:sans-serif; padding:4px; max-width:220px;">
          <h4 style="margin:0 0 4px 0; font-size:14px; font-weight:bold; color:#0f172a;">${pharmacy.name}</h4>
          <p style="margin:0 0 6px 0; font-size:11px; color:#64748b;">${pharmacy.address}, ${pharmacy.delegation}</p>
          ${
            pharmacy.phone
              ? `<a href="${formatPhoneTelUri(pharmacy.phone)}" style="display:inline-block; font-size:11px; font-weight:bold; color:#059669; text-decoration:none; margin-bottom:6px;">📞 ${pharmacy.phone}</a><br/>`
              : ""
          }
          <a href="${getDirectionsUrl(pharmacy.latitude, pharmacy.longitude)}" target="_blank" rel="noopener noreferrer" style="display:inline-block; font-size:11px; font-weight:bold; color:#2563eb; text-decoration:none;">🧭 ${locale === "ar" ? "الاتجاهات" : "Itinéraire"}</a>
        </div>
      `;

      const marker = new maplibregl.Marker({ color: "#059669" })
        .setLngLat([pharmacy.longitude, pharmacy.latitude])
        .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(popupHtml))
        .addTo(map);
    });

    return () => {
      map.remove();
    };
  }, [pharmacies, userLocation, center, zoom, locale]);

  return <div ref={mapContainerRef} className={className} />;
};
