import { NextRequest, NextResponse } from "next/server";
import { getAllMedicines } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || undefined;
  const genericOnly = searchParams.get("genericOnly") === "true";
  const cnamOnly = searchParams.get("cnamOnly") === "true";

  const medicines = await getAllMedicines({ q, genericOnly, cnamOnly });

  return NextResponse.json({
    count: medicines.length,
    medicines,
  });
}
