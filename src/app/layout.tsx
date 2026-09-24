import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DPI Hôpital — Dossier Patient Informatisé",
  description:
    "Système de gestion des dossiers patients informatisés pour l'hôpital.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
                ＋
              </span>
              <div>
                <p className="text-lg font-bold leading-tight text-slate-900">
                  DPI Hôpital
                </p>
                <p className="text-xs text-slate-500">
                  Dossier Patient Informatisé
                </p>
              </div>
            </Link>
            <nav className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Patients
              </Link>
              <Link
                href="/patients/new"
                className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
              >
                + Nouveau patient
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-6 py-8 text-center text-xs text-slate-400">
          DPI Hôpital · Environnement de démonstration
        </footer>
      </body>
    </html>
  );
}
