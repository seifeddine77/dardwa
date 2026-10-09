import { NextRequest, NextResponse } from "next/server";
import {
  getAllDutySchedules,
  addDutySchedule,
  removeDutySchedule,
} from "@/lib/data/repository";
import { DutyType } from "@/types/domain.types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const governorate = searchParams.get("governorate") || undefined;
  const date = searchParams.get("date") || undefined;

  const schedules = await getAllDutySchedules({ governorate, date });
  return NextResponse.json({ schedules });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pharmacyId, dutyDate, dutyType, notes } = body;

    if (!pharmacyId || !dutyDate || !dutyType) {
      return NextResponse.json(
        { error: "pharmacyId, dutyDate et dutyType sont obligatoires." },
        { status: 400 }
      );
    }

    const newSchedule = await addDutySchedule({
      pharmacyId,
      dutyDate,
      dutyType: dutyType as DutyType,
      startTime: dutyType === "night" ? "20:00" : "08:00",
      endTime: dutyType === "night" ? "08:00" : "20:00",
      notes: notes || undefined,
    });

    return NextResponse.json({
      success: true,
      schedule: newSchedule,
      message: "Garde ajoutée avec succès au planning officiel.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur interne lors de l'ajout de la garde." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Paramètre id manquant." },
      { status: 400 }
    );
  }

  const removed = await removeDutySchedule(id);
  if (!removed) {
    return NextResponse.json(
      { error: "Garde introuvable ou déjà supprimée." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Garde supprimée avec succès.",
  });
}
