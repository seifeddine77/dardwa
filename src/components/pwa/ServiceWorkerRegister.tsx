"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // Service worker registered
        })
        .catch((err) => {
          // Registration failed (silent)
        });
    }
  }, []);

  return null;
}
