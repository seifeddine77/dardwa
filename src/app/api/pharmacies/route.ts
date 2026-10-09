import { NextRequest, NextResponse } from "next/server";
import { getAllPharmacies } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const governorate = searchParams.get("governorate") || undefined;

  const pharmacies = await getAllPharmacies({ governorate });

  return NextResponse.json({
    count: pharmacies.length,
    pharmacies,
  });
}
