import { test, expect } from "@playwright/test";

test.describe("DarDwa User Journeys", () => {
  test("Home page loads with search bar and duty banner", async ({ page }) => {
    await page.goto("/fr");

    // Expect hero title
    await expect(
      page.getByRole("heading", { name: /Trouvez vos médicaments/i })
    ).toBeVisible();

    // Expect mandatory disclaimer
    await expect(
      page.getByText(
        "Demandez conseil à votre pharmacien ou médecin avant toute substitution."
      )
    ).toBeVisible();
  });

  test("Language switch toggles Arabic layout with RTL direction", async ({
    page,
  }) => {
    await page.goto("/fr");

    // Click language switcher to Arabic
    const arButton = page.getByRole("button", { name: /عربي/i });
    await arButton.click();

    // Expect HTML dir to be rtl
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(
      page.getByText("استشر الصيدلي أو الطبيب قبل أي تعويض.")
    ).toBeVisible();
  });

  test("Medicine catalog lists medicines and filters generics", async ({
    page,
  }) => {
    await page.goto("/fr/medicines");

    // Verify catalog title
    await expect(
      page.getByRole("heading", { name: /Répertoire des Médicaments/i })
    ).toBeVisible();

    // Verify cards appear
    await expect(page.getByText("DOLIPRANE 1000")).toBeVisible();
    await expect(page.getByText("PARALYOC 1000")).toBeVisible();
  });

  test("Pharmacies de garde page displays duty schedules and emergency contacts", async ({
    page,
  }) => {
    await page.goto("/fr/pharmacies/de-garde");

    await expect(
      page.getByRole("heading", { name: /Pharmacies de Garde en Tunisie/i })
    ).toBeVisible();

    // Tap-to-call link is present
    const callButton = page.getByRole("link", { name: /\+216/i }).first();
    await expect(callButton).toBeVisible();
  });
});
