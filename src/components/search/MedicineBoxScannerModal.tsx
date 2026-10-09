"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/routing";
import {
  Camera,
  X,
  Upload,
  Loader2,
  CheckCircle2,
  Pill,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { processBoxScan } from "@/lib/ai/ai-service";
import { formatTndPrice } from "@/features/medicines/equivalence";
import { Medicine } from "@/types/domain.types";

interface MedicineBoxScannerModalProps {
  locale: string;
}

export const MedicineBoxScannerModal: React.FC<MedicineBoxScannerModalProps> = ({
  locale,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [matchedMedicine, setMatchedMedicine] = useState<Medicine | null>(null);
  const [extractedInfo, setExtractedInfo] = useState<{
    brandName: string;
    dosage?: string;
    form?: string;
  } | null>(null);
  const router = useRouter();

  const handleSimulateScan = async (sampleName: string = "DOLIPRANE 1000") => {
    setIsScanning(true);
    setMatchedMedicine(null);

    // Call our AI processor with guardrails
    const result = await processBoxScan(`data:image/jpeg;base64,sample_${sampleName}`);
    setIsScanning(false);

    if (result.success && result.matchedMedicine) {
      setExtractedInfo(result.rawExtracted);
      setMatchedMedicine(result.matchedMedicine);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition shadow-xs"
        title="Scanner une boîte de médicament avec l'IA"
      >
        <Sparkles className="h-3.5 w-3.5 text-purple-600" />
        <span>{locale === "ar" ? "مسح علبة دواء (IA)" : "Scanner une boîte (IA)"}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setMatchedMedicine(null);
                setExtractedInfo(null);
              }}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Module IA Phase 2 (Expérimental)</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {locale === "ar"
                  ? "التعرف على الدواء عبر صورة العلبة"
                  : "Reconnaissance d'une boîte de médicament"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                L&apos;IA extrait le nom et la forme, puis résout la fiche officielle <strong>exclusivement dans notre base de données</strong> pour garantir la sécurité et le prix officiel.
              </p>
            </div>

            {/* Privacy notice */}
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Conformité Loi 2004-63 : aucune photo n&apos;est conservée sur nos serveurs.</span>
            </div>

            {/* Scan Area */}
            {!matchedMedicine ? (
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-4 hover:border-purple-500 transition">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-700 mx-auto flex items-center justify-center">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">
                    Prenez en photo la boîte ou testez un échantillon :
                  </p>
                  <div className="flex justify-center gap-2 pt-3 flex-wrap">
                    <button
                      type="button"
                      disabled={isScanning}
                      onClick={() => handleSimulateScan("DOLIPRANE 1000")}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      {isScanning && <Loader2 className="h-3 w-3 animate-spin" />}
                      <span>Tester : Boîte Doliprane</span>
                    </button>
                    <button
                      type="button"
                      disabled={isScanning}
                      onClick={() => handleSimulateScan("CLAMOXYL 1g")}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
                    >
                      <span>Tester : Boîte Clamoxyl</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <Pill className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">
                        {matchedMedicine.brandName}
                      </h4>
                      <p className="text-xs text-emerald-800 font-semibold">
                        {matchedMedicine.dosage} • {matchedMedicine.form}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-800">
                    {formatTndPrice(matchedMedicine.publicPriceTnd, locale)}
                  </span>
                </div>

                <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Prix officiel issu de la base
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      router.push(`/medicines/${matchedMedicine.id}`);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
                  >
                    <span>Voir la fiche & alternatives</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
