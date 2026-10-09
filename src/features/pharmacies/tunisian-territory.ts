/**
 * The 24 Governorates (Wilayat) of Tunisia with French and Arabic names
 */
export interface Governorate {
  code: string;
  nameFr: string;
  nameAr: string;
  center: [number, number]; // [lng, lat]
}

export const TUNISIAN_GOVERNORATES: Governorate[] = [
  { code: "tunis", nameFr: "Tunis", nameAr: "تونس", center: [10.1815, 36.8002] },
  { code: "ariana", nameFr: "Ariana", nameAr: "أريانة", center: [10.1647, 36.8665] },
  { code: "ben_arous", nameFr: "Ben Arous", nameAr: "بن عروس", center: [10.2228, 36.7531] },
  { code: "manouba", nameFr: "Manouba", nameAr: "منوبة", center: [10.0863, 36.8083] },
  { code: "nabeul", nameFr: "Nabeul", nameAr: "نابل", center: [10.7376, 36.4561] },
  { code: "zaghouan", nameFr: "Zaghouan", nameAr: "زغوان", center: [10.1429, 36.4029] },
  { code: "bizerte", nameFr: "Bizerte", nameAr: "بنزرت", center: [9.8739, 37.2744] },
  { code: "beja", nameFr: "Béja", nameAr: "باجة", center: [9.1844, 36.7256] },
  { code: "jendouba", nameFr: "Jendouba", nameAr: "جندوبة", center: [8.7802, 36.5011] },
  { code: "le_kef", nameFr: "Le Kef", nameAr: "الكاف", center: [8.7049, 36.1822] },
  { code: "siliana", nameFr: "Siliana", nameAr: "سليانة", center: [9.3708, 36.085] },
  { code: "sousse", nameFr: "Sousse", nameAr: "سوسة", center: [10.6369, 35.8256] },
  { code: "monastir", nameFr: "Monastir", nameAr: "المنستير", center: [10.8261, 35.777] },
  { code: "mahdia", nameFr: "Mahdia", nameAr: "المهدية", center: [11.0622, 35.5047] },
  { code: "sfax", nameFr: "Sfax", nameAr: "صفاقس", center: [10.7602, 34.7405] },
  { code: "kairouan", nameFr: "Kairouan", nameAr: "القيروان", center: [10.0963, 35.6781] },
  { code: "kasserine", nameFr: "Kasserine", nameAr: "القصرين", center: [8.8365, 35.1676] },
  { code: "sidi_bouzid", nameFr: "Sidi Bouzid", nameAr: "سيدي بوزيد", center: [9.4849, 35.0382] },
  { code: "gabes", nameFr: "Gabès", nameAr: "قابس", center: [10.0982, 33.8815] },
  { code: "medenine", nameFr: "Médenine", nameAr: "مدنين", center: [10.4927, 33.3549] },
  { code: "tataouine", nameFr: "Tataouine", nameAr: "تطاوين", center: [10.4518, 32.9297] },
  { code: "gafsa", nameFr: "Gafsa", nameAr: "قفصة", center: [8.7842, 34.425] },
  { code: "tozeur", nameFr: "Tozeur", nameAr: "توزر", center: [8.1335, 33.9197] },
  { code: "kebili", nameFr: "Kébili", nameAr: "قبلي", center: [8.969, 33.7044] },
];
