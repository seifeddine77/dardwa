import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { ShieldCheck, Lock, EyeOff, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Protection des Données Personnelles (Loi 2004-63) - DarDwa",
  description:
    "Engagement de conformité rigoureuse avec la loi tunisienne n° 2004-63 relative à la protection des données à caractère personnel.",
};

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPolicyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Conformité Légale Tunisienne</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Politique de Confidentialité & Loi n° 2004-63
        </h1>
        <p className="text-sm text-slate-600">
          Protection de vos données personnelles sous l&apos;égide de la législation tunisienne et de l&apos;Instance Nationale de Protection des Données Personnelles (INPDP).
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900">
            1. Engagement Fondamental : Zéro Traçage Commercial
          </h2>
          <p>
            La plateforme DarDwa est un service public et citoyen. <strong>Nous ne vendons, ne louons et ne transmettons aucune donnée personnelle à des tiers</strong> ou à des courtiers de données publicitaires. Aucun cookie tiers ou pixel espion n&apos;est utilisé sur cette plateforme.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900">
            2. Traitement des Données de Géolocalisation
          </h2>
          <p>
            Lorsque vous cliquez sur le bouton « Autour de moi », les coordonnées GPS transmises par votre navigateur sont <strong>traitées exclusivement en mémoire locale dans votre appareil</strong> pour calculer la distance des officines. Vos coordonnées de latitude et longitude ne sont <strong>jamais enregistrées sur nos serveurs ni conservées dans une base de données</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900">
            3. Hachage Cryptographique des Adresses IP (Anti-Spam)
          </h2>
          <p>
            Pour prévenir les attaques par déni de service et les faux signalements tout en respectant l&apos;anonymat des usagers, nous appliquons un algorithme de hachage irréversible (SHA-256 avec sel rotatif quotidien). Seule une empreinte anonyme est utilisée pour la limitation de débit (5 requêtes par heure). <strong>Votre adresse IP réelle n&apos;est jamais stockée en clair</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-slate-900">
            4. Vos Droits (Accès, Rectification, Suppression)
          </h2>
          <p>
            Conformément aux dispositions de la <strong>Loi organique n° 2004-63 du 27 juillet 2004</strong> portant sur la protection des données à caractère personnel en République Tunisienne, tout utilisateur dispose d&apos;un droit d&apos;accès, de rectification et d&apos;opposition auprès de l&apos;équipe technique à l&apos;adresse : <code>contact@dardwa.tn</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
