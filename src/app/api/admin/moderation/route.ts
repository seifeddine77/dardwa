import { NextRequest, NextResponse } from "next/server";
import {
  getAllReports,
  setReportModerationStatus,
} from "@/lib/data/repository";
import { ModerationStatus } from "@/types/domain.types";

export const dynamic = "force-dynamic";

export async function GET() {
  const reports = await getAllReports();
  return NextResponse.json({ reports });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id et status sont obligatoires." },
        { status: 400 }
      );
    }

    if (!["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide ('approved', 'rejected', 'pending')." },
        { status: 400 }
      );
    }

    const updated = await setReportModerationStatus(
      id,
      status as ModerationStatus
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Signalement introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Statut du signalement mis à jour vers '${status}'.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la modération." },
      { status: 500 }
    );
  }
}
