import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | DarDwa - دار الدواء",
    default: "DarDwa | Médicaments, Génériques & Pharmacies de Garde en Tunisie",
  },
  description:
    "Plateforme citoyenne et solidaire pour trouver vos médicaments, comparer les génériques économiques et localiser les pharmacies de garde en Tunisie.",
  keywords: [
    "médicaments Tunisie",
    "pharmacie de garde",
    "générique Tunisie",
    "dawa tunisie",
    "CNAM remboursement",
    "صيدلية استمرار تونس",
    "أدوية تونس",
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "fr" | "ar")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const isRtl = locale === "ar";

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"}>
      <body className="antialiased font-sans flex flex-col min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
