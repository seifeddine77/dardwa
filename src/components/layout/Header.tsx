"use client";

import React, { useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Pill, HeartPulse, Menu, X, Globe, MapPin } from "lucide-react";

export const Header: React.FC = () => {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = (nextLocale: "fr" | "ar") => {
    router.replace(pathname, { locale: nextLocale });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1"
          >
            <div className="h-10 w-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:bg-brand-700 transition">
              <Pill className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-brand-700 transition">
                DarDwa <span className="text-brand-600 font-arabic text-lg font-bold">دار الدواء</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                Tunisie • تونس
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/medicines"
              className="text-sm font-semibold text-slate-700 hover:text-brand-600 transition"
            >
              {t("medicines")}
            </Link>
            <Link
              href="/pharmacies"
              className="text-sm font-semibold text-slate-700 hover:text-brand-600 transition"
            >
              {t("pharmacies")}
            </Link>
            <Link
              href="/pharmacies/de-garde"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full transition shadow-xs"
            >
              <HeartPulse className="h-4 w-4 animate-pulse text-emerald-600" />
              {t("dutyPharmacies")}
            </Link>
            <Link
              href="/report"
              className="text-sm font-semibold text-slate-700 hover:text-brand-600 transition"
            >
              {t("report")}
            </Link>
            <Link
              href="/solidarity"
              className="text-sm font-semibold text-slate-700 hover:text-brand-600 transition"
            >
              {locale === "ar" ? "تضامن" : "Solidarité"}
            </Link>
            <Link
              href="/admin"
              className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
              title="Back-office Administrateur"
            >
              Admin
            </Link>
          </nav>

          {/* Right actions: Language Switcher */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => toggleLanguage("fr")}
                className={`px-2.5 py-1 rounded-md transition ${
                  locale === "fr"
                    ? "bg-white text-brand-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                aria-label="Passer en français"
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => toggleLanguage("ar")}
                className={`px-2.5 py-1 rounded-md transition ${
                  locale === "ar"
                    ? "bg-white text-brand-700 shadow-xs font-bold font-arabic"
                    : "text-slate-600 hover:text-slate-900 font-arabic"
                }`}
                aria-label="التبديل إلى العربية"
              >
                عربي
              </button>
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => toggleLanguage(locale === "fr" ? "ar" : "fr")}
              className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-md border border-slate-200"
            >
              {locale === "fr" ? "عربي" : "FR"}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/medicines"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-brand-600"
          >
            {t("medicines")}
          </Link>
          <Link
            href="/pharmacies"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-brand-600"
          >
            {t("pharmacies")}
          </Link>
          <Link
            href="/pharmacies/de-garde"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-base font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg"
          >
            <HeartPulse className="h-5 w-5 text-emerald-600" />
            {t("dutyPharmacies")}
          </Link>
          <Link
            href="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-brand-600"
          >
            {t("report")}
          </Link>
          <Link
            href="/solidarity"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-brand-600"
          >
            {locale === "ar" ? "التضامن والمجتمع" : "Solidarité & Collecte"}
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-slate-800 hover:text-brand-600 pt-2 border-t border-slate-100"
          >
            Administration
          </Link>
        </div>
      )}
    </header>
  );
};
