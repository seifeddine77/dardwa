import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchMedicinesInMemory } from "@/features/search/search-service";
import { SEED_MEDICINES } from "@/lib/data/mock-dataset";

const searchSchema = z.object({
  q: z.string().trim().min(1).max(100),
  limit: z.coerce.number().min(1).max(50).default(15),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const limit = searchParams.get("limit") || "15";

  const validation = searchSchema.safeParse({ q, limit });
  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid search query", details: validation.error.format() },
      { status: 400 }
    );
  }

  const results = searchMedicinesInMemory(
    validation.data.q,
    SEED_MEDICINES,
    validation.data.limit
  );

  return NextResponse.json(
    {
      query: validation.data.q,
      count: results.length,
      results: results.map((r) => ({
        id: r.medicine.id,
        code: r.medicine.code,
        brandName: r.medicine.brandName,
        brandNameAr: r.medicine.brandNameAr,
        dosage: r.medicine.dosage,
        form: r.medicine.form,
        publicPriceTnd: r.medicine.publicPriceTnd,
        isGeneric: r.medicine.isGeneric,
        cnamCovered: r.medicine.cnamCovered,
        score: r.score,
        matchedOn: r.matchedOn,
        ingredients: r.medicine.ingredients,
      })),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
