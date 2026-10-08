"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Search, Loader2, Pill, CheckCircle, X, ArrowRight, ArrowLeft } from "lucide-react";
import { formatTndPrice } from "@/features/medicines/equivalence";

interface SearchHit {
  id: string;
  code: string;
  brandName: string;
  brandNameAr?: string;
  dosage: string;
  form: string;
  publicPriceTnd: number;
  isGeneric: boolean;
  cnamCovered: boolean;
  ingredients: Array<{ id: string; name: string; nameAr?: string }>;
}

interface MedicineAutocompleteProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const MedicineAutocomplete: React.FC<MedicineAutocompleteProps> = ({
  placeholder,
  className = "",
  autoFocus = false,
}) => {
  const tCommon = useTranslations("common");
  const tMed = useTranslations("medicine");
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isPending, startTransition] = useTransition();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&limit=8`
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
          setIsOpen(true);
          setSelectedIndex(-1);
        }
      } catch (err) {
        console.error("Search fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (query.trim()) {
          router.push(`/medicines?q=${encodeURIComponent(query.trim())}`);
        }
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      } else if (query.trim()) {
        router.push(`/medicines?q=${encodeURIComponent(query.trim())}`);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (hit: SearchHit) => {
    setIsOpen(false);
    setQuery("");
    startTransition(() => {
      router.push(`/medicines/${hit.id}`);
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-2xl mx-auto ${className}`}
    >
      <div className="relative flex items-center rounded-2xl bg-white shadow-md border-2 border-slate-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition">
        <div className="ms-4 text-slate-400 shrink-0">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          ) : (
            <Search className="h-5 w-5 text-emerald-600" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="search-results-list"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || tCommon("searchPlaceholder")}
          className="w-full py-3.5 px-3.5 text-base text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="p-1.5 me-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            aria-label="Effacer la recherche"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            if (query.trim()) {
              router.push(`/medicines?q=${encodeURIComponent(query.trim())}`);
            }
          }}
          className="me-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition shadow-xs hidden sm:inline-flex items-center gap-1.5"
        >
          <span>{tCommon("search")}</span>
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div
          id="search-results-list"
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-h-[460px] overflow-y-auto"
        >
          {results.length > 0 ? (
            <div className="py-2 divide-y divide-slate-100">
              <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Résultats suggérés ({results.length})
              </div>

              {results.map((hit, index) => {
                const isSelected = index === selectedIndex;
                const dciNames = hit.ingredients.map((i) =>
                  locale === "ar" && i.nameAr ? i.nameAr : i.name
                ).join(" + ");

                return (
                  <div
                    key={hit.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(hit)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`px-4 py-3 cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-emerald-50/80 border-s-4 border-emerald-600"
                        : "hover:bg-slate-50 border-s-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Pill className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-base">
                            {hit.brandName}
                          </span>
                          {hit.brandNameAr && (
                            <span className="font-arabic text-sm text-slate-500 font-semibold">
                              ({hit.brandNameAr})
                            </span>
                          )}
                          {hit.isGeneric ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {tMed("generic")}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {tMed("princeps")}
                            </span>
                          )}
                          {hit.cnamCovered && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 inline-flex items-center gap-1">
                              <CheckCircle className="h-2.5 w-2.5" />
                              CNAM
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-emerald-700 font-medium truncate mt-0.5">
                          DCI: {dciNames} • {hit.dosage} • {hit.form}
                        </p>
                      </div>
                    </div>

                    <div className="text-end shrink-0 ps-2">
                      <div className="text-sm font-extrabold text-slate-900">
                        {formatTndPrice(hit.publicPriceTnd, locale)}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        Prix public
                      </span>
                    </div>
                  </div>
                );
              })}

              <div className="p-2 bg-slate-50 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push(
                      `/medicines?q=${encodeURIComponent(query.trim())}`
                    );
                  }}
                  className="w-full text-xs font-bold text-emerald-700 hover:text-emerald-800 py-1.5 flex items-center justify-center gap-1.5"
                >
                  <span>Voir tous les résultats pour « {query} »</span>
                  <ArrowIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-slate-500">
              <p className="font-medium">
                Aucun médicament trouvé pour « {query} ».
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Vérifiez l&apos;orthographe ou essayez le nom de la molécule (DCI, ex: Paracétamol, Amoxicilline).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
