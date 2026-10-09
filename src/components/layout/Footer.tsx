"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ShieldCheck, HeartHandshake, FileText } from "lucide-react";

export const Footer: React.FC = () => {
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3">
            <h3 className="text-white text-lg font-bold flex items-center gap-2">
              <span>DarDwa</span>
              <span className="text-emerald-400 font-arabic">دار الدواء</span>
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {tCommon("appTagline")}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>Conforme à la loi tunisienne n° 2004-63 (Protection des données)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/medicines" className="hover:text-white transition">
                  {tNav("medicines")}
                </Link>
              </li>
              <li>
                <Link href="/pharmacies" className="hover:text-white transition">
                  {tNav("pharmacies")}
                </Link>
              </li>
              <li>
                <Link href="/pharmacies/de-garde" className="hover:text-white transition">
                  {tNav("dutyPharmacies")}
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-white transition">
                  {tNav("report")}
                </Link>
              </li>
              <li>
                <Link href="/solidarity" className="hover:text-white transition">
                  Solidarité & Collecte
                </Link>
              </li>
              <li>
                <Link href="/how-data-is-sourced" className="hover:text-white transition">
                  Origine des données (PCT)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  À propos du projet
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact & Assistance
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Disclaimer */}
          <div className="space-y-2">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider">
              Mentions Légales
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {tCommon("mandatoryDisclaimer")}
            </p>
            <div className="pt-2 flex flex-col space-y-1 text-xs text-slate-400">
              <Link href="/legal/privacy" className="hover:text-white transition">
                Politique de confidentialité & Données personnelles
              </Link>
              <Link href="/legal/disclaimer" className="hover:text-white transition">
                Avertissement médical réglementaire
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DarDwa.tn — Plateforme d&apos;intérêt public ouverte et indépendante.</p>
        </div>
      </div>
    </footer>
  );
};
