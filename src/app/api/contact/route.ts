import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  name: z.string().min(2, "Nom requis (au moins 2 caractères)"),
  email: z.string().email("Adresse email valide requise"),
  message: z.string().min(5, "Message trop court (au moins 5 caractères)").max(2000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation échouée", details: validation.error.format() },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Merci pour votre message ! L'équipe DarDwa vous répondra dans les plus brefs délais.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
