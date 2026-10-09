import { NextRequest, NextResponse } from "next/server";
import {
  createReportSchema,
  aggregateReports,
} from "@/features/reports/reports-service";
import { getActiveReports, addReport } from "@/lib/data/repository";
import { hashIpAddress, checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const medicineId = searchParams.get("medicineId");
  const pharmacyId = searchParams.get("pharmacyId");

  if (!medicineId || !pharmacyId) {
    return NextResponse.json(
      { error: "Paramètres medicineId et pharmacyId requis" },
      { status: 400 }
    );
  }

  const reports = await getActiveReports();
  const summary = aggregateReports(reports, medicineId, pharmacyId);

  return NextResponse.json({ summary });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod Validation
    const validation = createReportSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation échouée", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { medicineId, pharmacyId, status, email, website } = validation.data;

    // 2. Anti-Spam Honeypot check
    // If the hidden website honeypot field is filled, silently ignore (trap for bots)
    if (website && website.trim().length > 0) {
      return NextResponse.json({
        success: true,
        message: "Signalement enregistré",
      });
    }

    // 3. Cryptographic Rate Limiting (Law 2004-63 compliant: zero raw IP logged)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";
    const hashedIp = hashIpAddress(clientIp);

    const rateLimit = checkRateLimit(hashedIp, 5, 60 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error:
            "Limite de signalements atteinte (maximum 5 par heure). Veuillez réessayer plus tard.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateLimit.resetInMs / 1000).toString(),
          },
        }
      );
    }

    // 4. Save Report with 48h TTL
    const report = await addReport({
      medicineId,
      pharmacyId,
      status,
      userId: email,
    });

    return NextResponse.json(
      {
        success: true,
        report,
        message:
          "Merci ! Votre signalement a été enregistré avec succès pour 48 heures.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur interne lors du traitement du signalement" },
      { status: 500 }
    );
  }
}
