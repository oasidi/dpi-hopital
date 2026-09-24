import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { computeAge, formatDate, initials } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const patients = await prisma.patient.findMany({
    where: query
      ? {
          OR: [
            { nom: { contains: query } },
            { prenom: { contains: query } },
            { numeroDossier: { contains: query } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { consultations: true } } },
  });

  const totalPatients = await prisma.patient.count();
  const totalConsultations = await prisma.consultation.count();

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Patients" value={totalPatients} icon="👥" />
        <StatCard label="Consultations" value={totalConsultations} icon="🩺" />
        <StatCard
          label="Dossiers actifs"
          value={totalPatients}
          icon="📁"
        />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            Dossiers patients
          </h1>
          <form className="flex gap-2">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Rechercher (nom, prénom, dossier)…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:w-72"
            />
            <button
              type="submit"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Rechercher
            </button>
          </form>
        </div>

        {patients.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-500">
              {query
                ? `Aucun patient ne correspond à « ${query} ».`
                : "Aucun patient enregistré pour le moment."}
            </p>
            <Link
              href="/patients/new"
              className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              + Créer un dossier
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {patients.map((patient) => (
              <li key={patient.id}>
                <Link
                  href={`/patients/${patient.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                    {initials(patient.prenom, patient.nom)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">
                      {patient.prenom} {patient.nom}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {patient.numeroDossier} ·{" "}
                      {computeAge(patient.dateNaissance)} ans ·{" "}
                      {patient.sexe === "FEMME" ? "Femme" : "Homme"}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium text-slate-700">
                      {patient._count.consultations} consultation
                      {patient._count.consultations > 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-slate-400">
                      Né(e) le {formatDate(patient.dateNaissance)}
                    </p>
                  </div>
                  <span className="text-slate-300">›</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-2xl">
        {icon}
      </span>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}
