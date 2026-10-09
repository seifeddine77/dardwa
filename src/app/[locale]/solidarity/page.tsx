import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { VETTED_ORGANIZATIONS } from "@/features/solidarity/solidarity-service";
import { VolunteerForm } from "@/components/solidarity/VolunteerForm";
import {
  HeartHandshake,
  ShieldAlert,
  Building,
  Phone,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Solidarité Médicale & Bénévolat - DarDwa (دار الدواء)",
  description:
    "Annuaire des organismes légaux de collecte de médicaments inutilisés en Tunisie et engagement bénévole citoyen.",
};

interface SolidarityPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SolidarityPage({ params }: SolidarityPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <HeartHandshake className="h-4 w-4 text-emerald-600" />
          <span>{locale === "ar" ? "الفضاء التضامني والمدني" : "Pôle Solidarité & Engagement"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {locale === "ar"
            ? "التضامن الصحي والتبرع القانوني بالأدوية"
            : "Solidarité Médicale & Collecte Légale"}
        </h1>
        <p className="text-sm text-slate-600">
          Où déposer légalement vos médicaments non utilisés et comment participer bénévolement au projet DarDwa.
        </p>
      </div>

      {/* HARD RULE WARNING BOX: Strictly Prohibited P2P Exchange */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-black text-rose-950">
              {locale === "ar"
                ? "تنبيه قانوني وصحي حازم : منع تبادل أو بيع الأدوية بين الأفراد"
                : "Avertissement Légal Impératif : Interdiction des Échanges entre Particuliers"}
            </h3>
            <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
              En Tunisie, <strong>le don, la vente ou l&apos;échange de médicaments entre particuliers est formellement interdit par la loi</strong>. Cette interdiction protège les patients contre :
            </p>
            <ul className="text-xs text-rose-800 list-disc list-inside space-y-1">
              <li>Les ruptures de chaîne de conservation (chaleur estivale dépassant 25°C altérant la molécule).</li>
              <li>Le risque d&apos;intoxication, de contrefaçon ou d&apos;effets secondaires graves sans traçabilité.</li>
              <li>L&apos;absence de pharmacovigilance médicale agréée.</li>
            </ul>
            <p className="text-xs font-bold text-rose-950 pt-1">
              DarDwa ne publiera et ne tolérera JAMAIS d&apos;annonces de particuliers. Pour donner vos boîtes non ouvertes, adressez-vous exclusivement aux organismes agréés ci-dessous.
            </p>
          </div>
        </div>
      </div>

      {/* Vetted Organizations Directory */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Organismes Agréés pour la Collecte & l&apos;Aide Sociale
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Associations et comités humanitaires habilités à réceptionner et trier vos dons avec des pharmaciens bénévoles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VETTED_ORGANIZATIONS.map((org) => (
            <div
              key={org.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Collecte Légale Vérifiée
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {org.governorate}
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-900">{org.name}</h4>
                <p className="text-xs text-slate-500">{org.address}</p>
                <div className="text-[10px] text-slate-400">
                  Source : {org.source} • Vérifié le {org.lastVerifiedAt}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`tel:${org.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{org.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Volunteer Application Form */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
            <UserCheck className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-black text-slate-900">
            Devenir Bénévole Citoyen pour DarDwa
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Aidez-nous à vérifier la disponibilité des médicaments, traduire l&apos;interface ou nettoyer les données ouvertes. Candidatures validées manuellement par l&apos;équipe.
          </p>
        </div>

        <VolunteerForm locale={locale} />
      </section>
    </div>
  );
}
