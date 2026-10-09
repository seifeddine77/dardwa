import { NextRequest, NextResponse } from "next/server";
import { insertMedicines, insertPharmacies } from "@/lib/data/repository";
import { MedicineCsvRow, PharmacyCsvRow } from "@/features/admin/csv-importer";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, rows } = body;

    if (!type || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: "Type ('medicines' | 'pharmacies') et liste de lignes requis." },
        { status: 400 }
      );
    }

    if (type === "medicines") {
      const formatted = rows.map((r: MedicineCsvRow) => ({
        code: r.code,
        brandName: r.brand_name,
        brandNameAr: r.brand_name_ar || undefined,
        form: r.form,
        dosage: r.dosage,
        publicPriceTnd: r.public_price_tnd,
        isGeneric: r.is_generic,
        cnamCovered: r.cnam_covered,
        ingredients: [
          {
            id: `dci-${r.dci.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
            name: r.dci,
            strength: r.dosage,
          },
        ],
      }));

      const inserted = await insertMedicines(formatted);
      return NextResponse.json({
        success: true,
        count: inserted.length,
        items: inserted,
        message: `${inserted.length} médicament(s) importé(s) ou mis à jour avec succès dans le catalogue actif.`,
      });
    }

    if (type === "pharmacies") {
      const formatted = rows.map((r: PharmacyCsvRow) => ({
        name: r.name,
        nameAr: r.name_ar || undefined,
        governorate: r.governorate,
        delegation: r.delegation,
        address: r.address,
        phone: r.phone,
        latitude: r.latitude,
        longitude: r.longitude,
        isNightShiftCapable: false,
      }));

      const inserted = await insertPharmacies(formatted);
      return NextResponse.json({
        success: true,
        count: inserted.length,
        items: inserted,
        message: `${inserted.length} pharmacie(s) importée(s) avec succès dans la cartographie active.`,
      });
    }

    return NextResponse.json(
      { error: "Type non supporté. Choisissez 'medicines' ou 'pharmacies'." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur interne lors de l'importation." },
      { status: 500 }
    );
  }
}
