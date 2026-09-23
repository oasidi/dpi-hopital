import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addConsultation } from "@/app/actions";
import {
  computeAge,
  formatDate,
  formatDateTime,
  initials,
} from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      consultations: { orderBy: { date: "desc" } },
    },
  });

  if (!patient) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
          ← Retour aux patients
        </Link>
      </div>

      <section className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
          {initials(patient.prenom, patient.nom)}
        </span>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">
            {patient.prenom} {patient.nom}
          </h1>
          <p className="text-sm text-slate-500">
            Dossier {patient.numeroDossier}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-1 sm:text-right">
          <Info label="Âge" value={`${computeAge(patient.dateNaissance)} ans`} />
          <Info
            label="Sexe"
            value={patient.sexe === "FEMME" ? "Femme" : "Homme"}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DetailCard label="Date de naissance" value={formatDate(patient.dateNaissance)} />
        <DetailCard label="Groupe sanguin" value={patient.groupeSanguin ?? "—"} />
        <DetailCard label="Téléphone" value={patient.telephone ?? "—"} />
        <DetailCard label="Adresse" value={patient.adresse ?? "—"} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          Consultations ({patient.consultations.length})
        </h2>

        {patient.consultations.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            Aucune consultation enregistrée.
          </p>
        ) : (
          <ol className="space-y-3">
            {patient.consultations.map((c) => (
              <li
                key={c.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{c.motif}</p>
                  <span className="text-xs text-slate-400">
                    {formatDateTime(c.date)}
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-sm text-slate-600">
                  {c.diagnostic && (
                    <p>
                      <span className="font-medium text-slate-700">
                        Diagnostic :
                      </span>{" "}
                      {c.diagnostic}
                    </p>
                  )}
                  {c.traitement && (
                    <p>
                      <span className="font-medium text-slate-700">
                        Traitement :
                      </span>{" "}
                      {c.traitement}
                    </p>
                  )}
                  <p className="text-xs text-slate-400">Par {c.medecin}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Ajouter une consultation
        </h2>
        <form action={addConsultation} className="space-y-4">
          <input type="hidden" name="patientId" value={patient.id} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Motif" name="motif" required />
            <FormField label="Médecin" name="medecin" required />
            <FormField label="Diagnostic" name="diagnostic" />
            <FormField label="Traitement" name="traitement" />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
            >
              Enregistrer la consultation
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-slate-400">{label}: </span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-medium text-slate-800">{value}</p>
    </div>
  );
}

function FormField({
  label,
  name,
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </div>
  );
}
