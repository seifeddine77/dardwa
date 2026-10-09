import { NextRequest, NextResponse } from "next/server";
import { volunteerApplicationSchema } from "@/features/solidarity/solidarity-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = volunteerApplicationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation échouée", details: validation.error.format() },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Votre candidature bénévole a été reçue avec succès ! L'équipe DarDwa vous contactera par email après examen.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
