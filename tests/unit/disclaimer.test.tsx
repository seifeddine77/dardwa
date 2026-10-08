import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { DisclaimerNotice } from "@/components/medicine/DisclaimerNotice";
import frMessages from "@/i18n/messages/fr.json";
import arMessages from "@/i18n/messages/ar.json";

describe("DisclaimerNotice Component", () => {
  it("renders mandatory French medical substitution warning", () => {
    render(
      <NextIntlClientProvider locale="fr" messages={frMessages}>
        <DisclaimerNotice />
      </NextIntlClientProvider>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(
      screen.getByText(
        "Demandez conseil à votre pharmacien ou médecin avant toute substitution."
      )
    ).toBeInTheDocument();
  });

  it("renders mandatory Arabic medical substitution warning in RTL", () => {
    render(
      <NextIntlClientProvider locale="ar" messages={arMessages}>
        <DisclaimerNotice />
      </NextIntlClientProvider>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(
      screen.getByText("استشر الصيدلي أو الطبيب قبل أي تعويض.")
    ).toBeInTheDocument();
  });

  it("renders compact mode with the warning text", () => {
    render(
      <NextIntlClientProvider locale="fr" messages={frMessages}>
        <DisclaimerNotice compact />
      </NextIntlClientProvider>
    );

    expect(
      screen.getByText(
        "Demandez conseil à votre pharmacien ou médecin avant toute substitution."
      )
    ).toBeInTheDocument();
  });
});
