"use client";

import React, { useState } from "react";
import {
  validateMedicineCsv,
  validatePharmacyCsv,
  MedicineCsvRow,
  PharmacyCsvRow,
} from "@/features/admin/csv-importer";
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ArrowRight,
  Database,
} from "lucide-react";

const SAMPLE_MEDICINE_CSV = `code,brand_name,brand_name_ar,dci,dosage,form,public_price_tnd,is_generic,cnam_covered
PCT-201,PANADOL 500,بنادول 500,PARACETAMOL,500 mg,Comprimé,2.450,false,true
PCT-202,CEFUTIL 500,سيفوتيل 500,CEFUROXIME,500 mg,Comprimé enrobé,18.900,true,true
PCT-203,VOLTARENE 50,فولتارين 50,DICLOFENAC,50 mg,Comprimé gastro-résistant,4.350,false,true`;

const SAMPLE_PHARMACY_CSV = `name,name_ar,governorate,delegation,address,phone,latitude,longitude
Pharmacie Les Berges du Lac,صيدلية ضفاف البحيرة,Tunis,La Goulette,Rue du Lac Windermere,71960100,36.8321,10.2345
Pharmacie Sahloul,صيدلية سهلول,Sousse,Sousse Riadh,Boulevard Yasser Arafat,73369800,35.8367,10.5982`;

export const CsvImportView: React.FC<{ locale: string }> = ({ locale }) => {
  const [importType, setImportType] = useState<"medicines" | "pharmacies">(
    "medicines"
  );
  const [csvContent, setCsvContent] = useState<string>(SAMPLE_MEDICINE_CSV);
  const [validationResult, setValidationResult] = useState<any | null>(null);
  const [isImported, setIsImported] = useState<boolean>(false);

  const handleTypeChange = (type: "medicines" | "pharmacies") => {
    setImportType(type);
    setCsvContent(
      type === "medicines" ? SAMPLE_MEDICINE_CSV : SAMPLE_PHARMACY_CSV
    );
    setValidationResult(null);
    setIsImported(false);
  };

  const handleValidate = () => {
    setIsImported(false);
    if (importType === "medicines") {
      const result = validateMedicineCsv(csvContent);
      setValidationResult(result);
    } else {
      const result = validatePharmacyCsv(csvContent);
      setValidationResult(result);
    }
  };

  const handleConfirmImport = () => {
    setIsImported(true);
  };

  return (
    <div className="space-y-8">
      {/* Type Selector */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleTypeChange("medicines")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            importType === "medicines"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Spécialités Médicales (PCT)</span>
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange("pharmacies")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            importType === "pharmacies"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Annuaire des Pharmacies</span>
        </button>
      </div>

      {/* Editor & Input */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Contenu CSV (Encodage UTF-8, Séparateur virgule ou point-virgule)
          </label>
          <span className="text-[11px] text-slate-400">
            {importType === "medicines" ? "9 colonnes" : "8 colonnes"}
          </span>
        </div>

        <textarea
          rows={8}
          value={csvContent}
          onChange={(e) => {
            setCsvContent(e.target.value);
            setValidationResult(null);
            setIsImported(false);
          }}
          className="w-full font-mono text-xs bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleValidate}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Valider la syntaxe et prévisualiser</span>
          </button>
        </div>
      </div>

      {/* Validation Results Preview */}
      {validationResult && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              {validationResult.success ? (
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
              )}
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  {validationResult.success
                    ? "Fichier CSV valide et prêt pour ingestion"
                    : "Erreurs détectées dans le fichier"}
                </h4>
                <p className="text-xs text-slate-500">
                  {validationResult.rows.length} ligne(s) validée(s) sur{" "}
                  {validationResult.totalCount}
                </p>
              </div>
            </div>

            {validationResult.rows.length > 0 && !isImported && (
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2"
              >
                <Database className="h-4 w-4 text-emerald-400" />
                <span>Confirmer l&apos;importation en base</span>
              </button>
            )}
          </div>

          {isImported && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>
                Importation réussie ! {validationResult.rows.length} entrée(s) synchronisée(s) avec succès.
              </span>
            </div>
          )}

          {/* Errors list */}
          {validationResult.errors.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <span className="text-xs font-bold text-rose-900 block">
                Détail des erreurs :
              </span>
              <ul className="text-xs text-rose-800 list-disc list-inside space-y-1">
                {validationResult.errors.map((err: any, idx: number) => (
                  <li key={idx}>
                    Ligne {err.line} : {err.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Validated Rows Table Preview */}
          {validationResult.rows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    {importType === "medicines" ? (
                      <>
                        <th className="px-4 py-2.5 text-start">Code</th>
                        <th className="px-4 py-2.5 text-start">Nom</th>
                        <th className="px-4 py-2.5 text-start">DCI</th>
                        <th className="px-4 py-2.5 text-start">Prix DT</th>
                        <th className="px-4 py-2.5 text-start">Générique</th>
                        <th className="px-4 py-2.5 text-start">CNAM</th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-2.5 text-start">Nom</th>
                        <th className="px-4 py-2.5 text-start">Gouvernorat</th>
                        <th className="px-4 py-2.5 text-start">Téléphone</th>
                        <th className="px-4 py-2.5 text-start">Latitude</th>
                        <th className="px-4 py-2.5 text-start">Longitude</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {validationResult.rows.slice(0, 5).map((row: any, i: number) => (
                    <tr key={i}>
                      {importType === "medicines" ? (
                        <>
                          <td className="px-4 py-2.5 font-mono font-bold">{row.code}</td>
                          <td className="px-4 py-2.5 font-bold">{row.brand_name}</td>
                          <td className="px-4 py-2.5 text-slate-500">{row.dci}</td>
                          <td className="px-4 py-2.5 font-bold">{row.public_price_tnd.toFixed(3)} DT</td>
                          <td className="px-4 py-2.5">{row.is_generic ? "Oui" : "Non"}</td>
                          <td className="px-4 py-2.5">{row.cnam_covered ? "Oui" : "Non"}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2.5 font-bold">{row.name}</td>
                          <td className="px-4 py-2.5">{row.governorate}</td>
                          <td className="px-4 py-2.5 font-mono">{row.phone}</td>
                          <td className="px-4 py-2.5">{row.latitude}</td>
                          <td className="px-4 py-2.5">{row.longitude}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
