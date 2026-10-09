import { MetadataRoute } from "next";
import { SEED_MEDICINES } from "@/lib/data/mock-dataset";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://dardwa.tn";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/medicines",
    "/pharmacies",
    "/pharmacies/de-garde",
    "/report",
    "/about",
    "/how-data-is-sourced",
    "/legal/privacy",
    "/legal/disclaimer",
    "/contact",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static Pages for both languages
  routes.forEach((route) => {
    sitemapEntries.push({
      url: `${BASE_URL}/fr${route}`,
      lastModified: new Date(),
      changeFrequency: route.includes("de-garde") ? "hourly" : "weekly",
      priority: route === "" ? 1.0 : 0.8,
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr${route}`,
          ar: `${BASE_URL}/ar${route}`,
        },
      },
    });
  });

  // Dynamic Medicine Pages
  SEED_MEDICINES.forEach((med) => {
    sitemapEntries.push({
      url: `${BASE_URL}/fr/medicines/${med.id}`,
      lastModified: new Date(med.lastUpdatedAt),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr/medicines/${med.id}`,
          ar: `${BASE_URL}/ar/medicines/${med.id}`,
        },
      },
    });
  });

  return sitemapEntries;
}
