import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Assistance - DarDwa (دار الدواء)",
  description:
    "Contactez l'équipe de DarDwa pour signaler une anomalie, suggérer une amélioration ou proposer un partenariat citoyen.",
};

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {locale === "ar" ? "اتصل بفريق دار الدواء" : "Contactez l'Équipe DarDwa"}
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          {locale === "ar"
            ? "نحن في خدمتكم للإجابة عن استفساراتكم أو لتلقي مقترحاتكم لتحسين المنصة."
            : "Une question, un signalement d'erreur de prix ou une proposition de collaboration bénévole ? Écrivez-nous."}
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Votre nom</label>
            <input
              type="text"
              placeholder="Mohamed Ben Ali"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Adresse email</label>
            <input
              type="email"
              placeholder="contact@exemple.tn"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Message</label>
            <textarea
              rows={5}
              placeholder="Votre message..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="button"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
          >
            <Send className="h-4 w-4" />
            <span>Envoyer le message</span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Mail className="h-4 w-4 text-emerald-600" />
          <span>Email direct : <strong>contact@dardwa.tn</strong></span>
        </div>
      </div>
    </div>
  );
}
